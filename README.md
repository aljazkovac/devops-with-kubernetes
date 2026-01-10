# DevOps with Kubernetes

Course [DevOps with Kubernetes](https://courses.mooc.fi/org/uh-cs/courses/devops-with-kubernetes) from University of Helsinki.

## Exercises

### Chapter 2: Kubernetes Basics

- [1.1](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.1/log_output) - First Application Deploy (log_output)
- [1.2](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.2/todo_app) - TODO Application (todo_app)
- [1.3](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.3/log_output) - Declarative Deployment Manifests (log_output)
- [1.4](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.4/todo_app) - Declarative Deployment for TODO app (todo_app)
- [1.5](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.5/todo_app) - Port forwarding for the TODO app (todo_app)
- [1.6](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.6/todo_app) - Use a NodePort service for the TODO app (todo_app)
- [1.7](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.7/log_output) - Add HTTP Endpoint to Log Output App (log_output)
- [1.8](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.8/todo_app) - Use Ingress for the TODO app (todo_app)
- [1.9](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.9/pingpong) - Ping-Pong Application with Shared Ingress (pingpong)
- [1.10](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.10/log_output) - Multi-Container Pod with Shared Storage (log_output)
- [1.11](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.11) - Shared Persistent Volume Storage
- [1.12](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.12/todo_app) - Random Image from Lorem Picsum (todo_app)
- [1.13](https://github.com/aljazkovac/devops-with-kubernetes/tree/1.13/todo_app) - TODO App Input Functionality (todo_app)

### Chapter 3: More Building Blocks

- [2.1](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.1) - Connect Log Output and Ping Pong Applications with HTTP
- [2.2](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.2) - Create a Todo Backend Service
- [2.3](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.3) - Separate namepaces
- [2.4](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.4) - Separate namespaces
- [2.5](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.5/log_output) - ConfigMaps
- [2.6](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.6) - Env variables
- [2.7](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.7/pingpong) - Run a postgres database as a stateful set
- [2.8](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.8) - Postgres database with ConfigMaps
- [2.9](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.9/todo-backend) - CronJobs
- [2.10](https://github.com/aljazkovac/devops-with-kubernetes/tree/2.10) - Set up monitoring

### Chapter 4: To the Cloud

- [3.1](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.1/pingpong) - Deploy pingpong app to GKE
- [3.2](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.2) - Deploy log-output and pingpong to GKE and expose via ingress
- [3.3](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.3) - Expose log-output and pingpong via Gateway API instead of Ingress
- [3.4](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.4) - Use rewrite in route
- [3.5](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.5) - Deploy TODO project to GKE
- [3.6](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.6) - Set up automatic deployment for the project
- [3.7](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.7) - Improve the deployment workflow with separate namespace per environment
- [3.8](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.8) - Deleting a branch deletes an environment
- [3.9](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.9) - DBaaS vs. DIY
- [3.10](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.10) - Backup database to Google Cloud
- [3.11](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.11) - Scaling
- [3.12](https://github.com/aljazkovac/devops-with-kubernetes/tree/3.12) - Logging

---

#### Exercise 3.9: DBaaS vs DIY

For stateful applications like the _pingpong_ and _todo-backend_ services, choosing the right database strategy is a critical architectural decision. The two primary approaches are using a managed Database as a Service (DBaaS) like Google Cloud SQL, or self-managing a database (e.g., PostgreSQL) on the Kubernetes cluster using Persistent Volumes.

As seen in the project's manifests (`pingpong/manifests/statefulset.yaml` and `todo-project/kustomize/base/todo-backend-statefulset.yaml`), this repository currently uses the self-managed approach with a `StatefulSet` and a `volumeClaimTemplate`. This is a great way to learn the fundamentals of running stateful workloads on Kubernetes.

Below is a comparison of the two approaches to help understand the trade-offs.

##### Quick Comparison

| Feature               | Self-Managed on GKE (Current Approach)                                                                | DBaaS (e.g., Google Cloud SQL)                                                 |
| :-------------------- | :---------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **Management Effort** | **High** - You manage everything.                                                                     | **Low** - Fully managed by the cloud provider.                                 |
| **Control**           | **Full** - Complete control over version, extensions, tuning.                                         | **Limited** - Abstracted away, less configuration control.                     |
| **Initial Setup**     | Moderate to Complex (Requires K8s manifests, container images).                                       | Simple (A few clicks in the UI or a simple API call).                          |
| **Cost**              | Lower direct infrastructure cost, but **high TCO** (Total Cost of Ownership) due to engineering time. | Higher direct service cost, but **lower TCO** for most teams.                  |
| **High Availability** | Manual setup required (e.g., replicas, failover logic).                                               | Built-in, often with a single checkbox and an SLA.                             |
| **Backups & PITR**    | Manual setup required (e.g., `pg_dump` CronJobs, Velero, or operators like CloudNativePG).            | Automated, built-in, and includes Point-in-Time Recovery (PITR).               |
| **Maintenance**       | **Manual** - You are responsible for all patching and version upgrades.                               | **Automatic** - Managed by the provider with configurable maintenance windows. |
| **Best For**          | Learning, custom requirements, teams with deep DBA/K8s expertise.                                     | Production workloads, focusing on application development, reliability.        |

---

##### Detailed Breakdown

###### 1. Initial Setup & Work Required

- **Self-Managed on GKE:** This requires creating detailed Kubernetes manifests, including `StatefulSets` for stable identity, `Services` for networking, `PersistentVolumeClaims` for storage, and `ConfigMaps` or `Secrets` for configuration. You are responsible for sourcing a correct and secure container image. The current project demonstrates this process well.
- **DBaaS (Cloud SQL):** Provisioning is significantly simpler. It can be done via the cloud provider's web console in minutes or automated with a simple Terraform script or `gcloud` command. Securely connecting from GKE is straightforward using the Cloud SQL Auth Proxy.

###### 2. Cost Analysis

- **Self-Managed on GKE:** You pay for the raw resources: the GKE nodes (VMs) that run the database pods and the Persistent Disk storage. While this seems cheaper on paper, the **Total Cost of Ownership (TCO)** is often much higher because it doesn't account for the significant engineering hours spent on setup, maintenance, backups, and troubleshooting.
- **DBaaS (Cloud SQL):** The sticker price is higher because it bundles the cost of compute, storage, and the management service itself. However, by offloading all administrative tasks, it dramatically reduces operational overhead, leading to a lower TCO for most use cases.

###### 3. Maintenance & Operations

- **Self-Managed on GKE:** You are entirely responsible for all maintenance. This includes OS patching within the container, applying minor version updates for PostgreSQL, handling security vulnerabilities, and managing resource scaling. This is a significant, ongoing operational burden that requires specialized expertise.
- **DBaaS (Cloud SQL):** This is the biggest advantage of a managed service. The cloud provider handles all patching and updates automatically. You can typically define a preferred maintenance window (e.g., Sunday at 2 AM) to minimize disruption.

###### 4. Backup, Restore, and Disaster Recovery

- **Self-Managed on GKE:** This is a complex but critical task that you must design and implement yourself. Common strategies include:
  - **Logical Backups:** Running `pg_dump` in a `CronJob` and uploading the dump to cloud storage. Simple, but inefficient for large databases and doesn't provide easy Point-in-Time Recovery (PITR).
  - **Volume Snapshots:** Taking snapshots of the `PersistentVolume`. This is fast but carries a risk of data inconsistency unless the database is quiesced or the snapshot is taken from a replica.
  - **Specialized Operators:** Using a Kubernetes Operator like [CloudNativePG](https://cloudnative-pg.io/) or [Crunchy Data's PGO](https://www.crunchydata.com/products/crunchy-postgresql-for-kubernetes) to manage the database lifecycle, including robust backup and PITR capabilities. This is the most powerful self-managed option but adds another layer of technology to learn and manage.
- **DBaaS (Cloud SQL):** Backup and restore are built-in features. You can enable automated daily backups with a configurable retention policy. More importantly, it offers **Point-in-Time Recovery (PITR)**, allowing you to restore the database to any specific second within the retention window (e.g., just before a faulty deployment wiped data). This is a powerful feature that is very complex to achieve in a self-managed environment.

##### Conclusion & Recommendation for This Project

- For a **production environment**, a **DBaaS like Google Cloud SQL is almost always the recommended choice**. The benefits of reliability, automated maintenance, and powerful recovery features provided by a managed service far outweigh the perceived cost savings of a self-managed solution. It allows the development team to focus on building the application, not on becoming database administrators.

- For the **context of this educational repository**, the **self-managed approach is the correct and more valuable choice**. It forces you to engage with and solve the challenges of running stateful applications on Kubernetes. By setting up `StatefulSets`, managing `PersistentVolumes`, and thinking about backup strategies, you gain a much deeper understanding of the platform's capabilities and limitations.

---

### Chapter 5: GitOps and Friends

- [4.1](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.1) - Readines probes
- [4.2](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.2) - Health probes on the project
- [4.3](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.3) - Prometheus query
- [4.4](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.4) - Canary release
- [4.5](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.5) - TODOs Mark as Done
- [4.6](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.6) - Broadcaster service
- [4.7](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.7) - Baby Steps to GitOps
- [4.8](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.8) - TODO Project GitOps
- [4.9](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.9) - TODO Project environments
- [4.10](https://github.com/aljazkovac/devops-with-kubernetes/tree/4.10) - TODO Project Full GitOps (see [config repo](https://github.com/aljazkovac/devops-with-kubernetes-gitops)).

---

#### Exercise 4.3: Prometheus

The query: `sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})`

---

### Chapter 6: Under the Hood

- [5.1](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.1) - DIY CRD & Controller

- [5.2](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.2) - Getting Started with ISTIO Service Mesh

- [5.3](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.3) - Log app, the Service Mesh Edition

- [5.4](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.4) - Wikipedia with init and sidecar

- [5.5](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.5) - Platform Comparison

- [5.6](https://github.com/aljazkovac/devops-with-kubernetes/tree/5.6) - Serverless with Knative

---

#### Exercise 5.2: Istio Service Mesh (Ambient Mode)

This exercise focuses on the transition from traditional ingress to a Service Mesh architecture using **Istio Ambient Mode**. Unlike the "sidecar" approach, Ambient mode splits Istio's functionality into a shared Layer 4 secure overlay (via `ztunnel`) and an optional Layer 7 processing layer (via `waypoint` proxies), reducing resource overhead and simplifying operations.

The setup for this exercise includes:

- **Istio Installation**: Deployed with the `ambient` profile on a `k3d` cluster.
- **Gateway API**: Leverages the Kubernetes Gateway API (`gateway.networking.k8s.io`) rather than the legacy Istio `VirtualService` or `Gateway` resources.
- **Sample Application**: Deployment of the Bookinfo application to verify mTLS security and traffic routing.

The **`service-mesh/`** directory contains the core networking manifests exported from the cluster (`kubectl get -o yaml`):

- `gateway.yaml`: Defines the entry point into the mesh using the `istio` GatewayClass.
- `route.yaml`: An `HTTPRoute` that connects the gateway to the `productpage` service.

To replicate this setup, ensure the Gateway API CRDs are installed before applying these manifests.

---

#### Exercise 5.5: Platform Comparison

This exercise involves comparing two Kubernetes service providers. I have chosen to compare **Rancher** and **OpenShift**.

##### Submission Summary (Max 150 words)

- **Rancher** is a multi-cluster management platform that works with any CNCF-certified Kubernetes distribution. It focuses on flexibility and operational consistency across diverse environments (cloud, on-prem, edge).
- **OpenShift** is an opinionated, full-stack enterprise PaaS by Red Hat. It integrates a specific OS, CI/CD tools, and security defaults into a cohesive but rigid ecosystem.
- **Verdict:** **Rancher is better** for modern DevOps teams.
- **Argument:** Rancher avoids vendor lock-in by managing "vanilla" Kubernetes clusters (GKE, EKS, K3s) under a single pane of glass. It is significantly more lightweight and accessible than OpenShift, which requires a heavy Red Hat-centric stack. Rancher’s modularity allows teams to adapt their infrastructure as they grow, rather than being forced into a specific proprietary integration.

##### Detailed Comparison: Rancher vs. OpenShift

- **Philosophy & Focus:**

  - **Rancher:** Focuses on **multi-cluster management**. It acts as a "manager of managers," allowing you to unify the operations of any Kubernetes distribution (EKS, AKS, GKE, K3s, RKE) under a single pane of glass. It is lightweight and flexible.
  - **OpenShift:** Focuses on being a **complete enterprise Platform as a Service (PaaS)**. It is an "opinionated" distribution that dictates the entire stack, from the OS (Red Hat CoreOS) to the CI/CD pipelines and developer tools.

- **Flexibility vs. Integration:**

  - **Rancher:** Highly **flexible**. It doesn't lock you into a specific ecosystem. You can run it on any infrastructure and manage diverse clusters side-by-side. It is open-source friendly and works well with standard CNCF tools.
  - **OpenShift:** Highly **integrated**. It provides a cohesive, "batteries-included" experience with built-in monitoring, logging, and developer consoles. However, this comes at the cost of flexibility and a heavier resource footprint.

- **Target Audience:**
  - **Rancher:** Best for teams that need to manage **diverse infrastructure**, want to avoid vendor lock-in, or prefer a lightweight, modular approach to building their platform.
  - **OpenShift:** Best for **large enterprises** that want a standardized, supported, and secure-by-default platform across the entire organization, and are willing to pay for the "Red Hat way."

##### The Verdict: Rancher

For the context of a general "DevOps" approach that values **flexibility, adaptability, and multi-cloud capability**, I argue that **Rancher** is the better choice.

- **Why Rancher wins:**
  - **No Lock-in:** Rancher empowers you to choose the best underlying Kubernetes engine for each specific use case (e.g., K3s for edge, EKS for production, RKE for on-prem) without fragmenting your operations. OpenShift often forces you into the "OpenShift Island."
  - **Lower Barrier to Entry:** You can spin up a Rancher management server in minutes on a single node. OpenShift's installation and resource requirements are significantly higher.
  - **True Multi-Cluster:** As organizations grow, they inevitably end up with clusters in different clouds. Rancher is designed from the ground up to solve this specific problem, whereas OpenShift is primarily focused on managing OpenShift clusters.

---

#### Exercise 5.6: Serverless with Knative

This exercise demonstrates the deployment of a serverless application using **Knative Serving** on a local `k3d` cluster.

**Key Components:**

- **Knative Serving:** Manages the lifecycle of serverless workloads (deployments, revisions, routes).
- **Kourier:** A lightweight Ingress controller/networking layer for Knative, chosen for its suitability for local environments compared to Istio.
- **Magic DNS (sslip.io):** Provides automatic DNS resolution for local IPs (e.g., `172.18.0.3.sslip.io`).

**Implementation Details:**
The exercise involves:

1. **Cluster Setup:** Creating a `k3d` cluster with mapped ports (`8081:80`) and Traefik disabled to allow Kourier to manage ingress.
2. **Deployment:** Deploying the `helloworld-go` sample app.
3. **Scale-to-Zero:** Verifying that pods terminate after inactivity and spin up ("cold start") upon receiving a request.
4. **Traffic Splitting:** Configuring a "Canary" release by splitting traffic 50/50 between two revisions (blue/green deployment).

For full artifacts and commands, see the [knative-exercise/](knative-exercise/) directory.

---
