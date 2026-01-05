# Strategic Plan for Exercise 5.1: DIY CRD & Controller

## 1. Understanding the Goal

The objective is to extend the Kubernetes API with a Custom Resource Definition (CRD) called `DummySite` and implement a custom Controller.

- **Input:** A `DummySite` resource containing a `website_url`.
- **Action:** The Controller detects the new resource, fetches the HTML from the specified URL, and creates the necessary Kubernetes resources to serve a static copy of that website.
- **Output:** A running Service and Deployment serving the cloned HTML content.

## 2. Investigation & Analysis

### Current State

- The repository contains standard Node.js applications (`pingpong`, `log-output`) but no existing Kubernetes Operators or Controllers.
- There are no existing CRDs defined.
- This will be a "greenfield" addition to the repository.

### Key Decisions

- **Language:** Node.js (JavaScript) to maintain consistency with the rest of the repository.
- **Library:** `@kubernetes/client-node` for interacting with the K8s API.
- **Architecture:**
  - **The Controller** will run as a pod in the cluster.
  - **The "Copy" Mechanism:** To avoid building custom images for every site, the Controller will:
    1. Fetch the HTML content of the target URL _in memory_.
    2. Save this HTML into a **ConfigMap**.
    3. Create a generic **Nginx Deployment** that mounts this ConfigMap as `index.html`.
    4. Create a **Service** to expose that Nginx deployment.

## 3. Proposed Strategic Approach

### Phase 1: Project Scaffolding

- [x] Create a new directory: `dummy-site-controller`.
- [x] Initialize a Node.js project (`package.json`).
- [x] Install dependencies: `@kubernetes/client-node`, `axios` (for fetching the website).

### Phase 2: CRD Definition

- [x] Create `manifests/dummysite-crd.yaml`.

- [x] Define the schema to accept `spec.website_url` (string).

### Phase 3: Controller Implementation (`index.js`)

- [x] **Watch Loop:** Implement a watcher for the `DummySite` resource group `stable.dwk`.

- [x] **Reconciliation Logic:**

  - When a `DummySite` is **Added/Modified**:

    1. Extract `website_url`.

    2. HTTP GET the URL content.

    3. **Construct Resources:**

       - `ConfigMap`: Key `index.html` containing the fetched body.

       - `Deployment`: Image `nginx:alpine`, mounting the ConfigMap to `/usr/share/nginx/html`.

       - `Service`: Exposing port 80.

    4. Apply these resources using the K8s client.

  - When a `DummySite` is **Deleted**:

    - Ideally, use **OwnerReferences** on the created child resources (Deployment, Service, ConfigMap) pointing to the `DummySite` parent. This ensures Kubernetes garbage collection automatically deletes the children when the parent is deleted, simplifying the controller logic.

### Phase 4: RBAC and Deployment Manifests

- [x] Create `manifests/rbac.yaml`:

  - `ServiceAccount` for the controller.

  - `ClusterRole` granting permissions to:

    - `list`, `watch` `dummysites`.

    - `create`, `delete` `deployments`, `services`, `configmaps`.

  - `ClusterRoleBinding`.

- [x] Create `manifests/controller-deployment.yaml` to run the controller code itself.

- [x] Create `Dockerfile` for the controller.

## 4. Verification Strategy

1. **Build & Push:** Build the controller image and push to a registry (or load into a local cluster like kind/minikube).
2. **Deploy Infrastructure:** `kubectl apply -f manifests/` (CRD, RBAC, Controller Deployment).
3. **Test Usage:**

   - Create a file `example-site.yaml`:

     ```yaml
     apiVersion: stable.dwk/v1
     kind: DummySite
     metadata:
       name: example-site
     spec:
       website_url: https://example.com
     ```

   - `kubectl apply -f example-site.yaml`

4. **Validate:**
   - Check logs of the controller: `kubectl logs -l app=dummy-site-controller`
   - Check if resources exist: `kubectl get cm,deploy,svc`
   - Verify content: `kubectl port-forward svc/example-site 8080:80` -> Visit `localhost:8080` to see the Example Domain.

## 5. Anticipated Challenges & Considerations

- **ConfigMap Size Limit:** ConfigMaps are limited to 1MB. If `website_url` points to a large page, the update will fail. _Mitigation:_ This is an exercise; we will assume reasonably sized pages or truncate content if necessary.
- **Network Access:** The Controller Pod needs internet access to fetch `website_url`. This is standard but worth noting if network policies are strict.
- **Latency:** The "Reconcile" loop shouldn't block. We will use async/await properly.
- **Consistency:** If the website content changes, our controller won't know unless the `DummySite` resource is updated (triggering a reconcile). This satisfies the "Snapshot/Copy" requirement.
