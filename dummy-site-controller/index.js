const k8s = require("@kubernetes/client-node");
const axios = require("axios");

// Initialize Kubernetes configuration from the environment (e.g., ~/.kube/config or InCluster config)
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Create API clients for different Kubernetes resource types
const k8sApi = kc.makeApiClient(k8s.CoreV1Api); // For ConfigMaps and Services
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api); // For Deployments
const k8sCustomApi = kc.makeApiClient(k8s.CustomObjectsApi); // For our Custom Resource (DummySite)
const watch = new k8s.Watch(kc); // For watching events in real-time

// CRD specific constants
const GROUP = "stable.dwk";
const VERSION = "v1";
const PLURAL = "dummysites";

/**
 * Helper to fetch the HTML content of the target website.
 */
async function fetchWebsite(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching URL ${url}: ${error.message}`);
    return `<html><body><h1>Error fetching site</h1><p>${error.message}</p></body></html>`;
  }
}

/**
 * Creates an OwnerReference object.
 * This is crucial! It tells Kubernetes that the ConfigMap, Deployment, and Service
 * "belong" to the DummySite. When the DummySite is deleted, K8s will automatically
 * delete these resources (Garbage Collection).
 */
function getOwnerReference(dummySite) {
  return [
    {
      apiVersion: `${GROUP}/${VERSION}`,
      kind: "DummySite",
      name: dummySite.metadata.name,
      uid: dummySite.metadata.uid,
      controller: true,
      blockOwnerDeletion: true,
    },
  ];
}

/**
 * Creates or updates a ConfigMap containing the fetched HTML.
 */
async function createConfigMap(namespace, name, htmlContent, ownerRef) {
  const configMap = {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: `${name}-config`,
      namespace: namespace,
      ownerReferences: ownerRef,
    },
    data: {
      "index.html": htmlContent,
    },
  };

  try {
    await k8sApi.createNamespacedConfigMap(namespace, configMap);
    console.log(`Created ConfigMap: ${name}-config`);
  } catch (err) {
    // If it already exists (HTTP 409), we replace it with the new HTML
    if (err.response && err.response.statusCode === 409) {
      await k8sApi.replaceNamespacedConfigMap(
        `${name}-config`,
        namespace,
        configMap
      );
      console.log(`Updated ConfigMap: ${name}-config`);
    } else {
      console.error(`Error creating/updating ConfigMap: ${err}`);
    }
  }
}

/**
 * Creates a Deployment running Nginx, mounting the ConfigMap as the website root.
 */
async function createDeployment(namespace, name, ownerRef) {
  const deployment = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: `${name}-deploy`,
      namespace: namespace,
      ownerReferences: ownerRef,
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: name } },
      template: {
        metadata: { labels: { app: name } },
        spec: {
          containers: [
            {
              name: "nginx",
              image: "nginx:alpine",
              ports: [{ containerPort: 80 }],
              volumeMounts: [
                {
                  name: "html-volume",
                  mountPath: "/usr/share/nginx/html",
                },
              ],
            },
          ],
          volumes: [
            {
              name: "html-volume",
              configMap: { name: `${name}-config` },
            },
          ],
        },
      },
    },
  };

  try {
    await k8sAppsApi.createNamespacedDeployment(namespace, deployment);
    console.log(`Created Deployment: ${name}-deploy`);
  } catch (err) {
    if (err.response && err.response.statusCode !== 409) {
      console.error(`Error creating Deployment: ${err}`);
    }
  }
}

/**
 * Creates a Service to expose the Nginx deployment.
 */
async function createService(namespace, name, ownerRef) {
  const service = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: `${name}-svc`,
      namespace: namespace,
      ownerReferences: ownerRef,
    },
    spec: {
      selector: { app: name },
      ports: [{ protocol: "TCP", port: 80, targetPort: 80 }],
    },
  };

  try {
    await k8sApi.createNamespacedService(namespace, service);
    console.log(`Created Service: ${name}-svc`);
  } catch (err) {
    if (err.response && err.response.statusCode !== 409) {
      console.error(`Error creating Service: ${err}`);
    }
  }
}

/**
 * The "Reconciliation Loop" logic.
 * Ensures the cluster state matches the desired state defined in the DummySite resource.
 */
async function reconcile(obj) {
  const { namespace, name } = obj.metadata;
  const url = obj.spec.website_url;

  console.log(`Reconciling DummySite: ${name} (URL: ${url})`);

  const html = await fetchWebsite(url);
  const ownerRef = getOwnerReference(obj);

  // 1. Save HTML to ConfigMap
  await createConfigMap(namespace, name, html, ownerRef);
  // 2. Ensure Deployment exists
  await createDeployment(namespace, name, ownerRef);
  // 3. Ensure Service exists
  await createService(namespace, name, ownerRef);
}

/**
 * Watches for changes to DummySite resources.
 */
function startWatch() {
  const path = `/apis/${GROUP}/${VERSION}/${PLURAL}`;
  console.log(`Watching for events at: ${path}`);

  watch.watch(
    path,
    {},
    (type, obj) => {
      // When a resource is Added or Modified, run the reconciliation
      if (type === "ADDED" || type === "MODIFIED") {
        reconcile(obj).catch((err) => console.error("Reconcile error:", err));
      } else if (type === "DELETED") {
        console.log(
          `DummySite ${obj.metadata.name} deleted. Child resources will be removed by K8s.`
        );
      }
    },
    (err) => {
      if (err) console.error("Watch error:", err);
      console.log("Restarting watch...");
      setTimeout(startWatch, 1000); // Wait 1s before restarting to avoid tight loops on error
    }
  );
}

startWatch();
