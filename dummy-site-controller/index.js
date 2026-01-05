const k8s = require("@kubernetes/client-node");
const axios = require("axios");

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const watch = new k8s.Watch(kc);

const GROUP = "stable.dwk";
const VERSION = "v1";
const PLURAL = "dummysites";

async function fetchWebsite(url) {
  console.log(`Fetching website: ${url}`);
  try {
    const userAgent = "DWK super cool bot";
    const headers = { "User-Agent": userAgent };
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error fetching URL ${url}: ${error.message}`);
    return `<html><body><h1>Error fetching site</h1><p>${error.message}</p></body></html>`;
  }
}

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

async function createConfigMap(namespace, name, htmlContent, ownerRef) {
  const cmName = `${name}-config`;
  console.log(`Creating ConfigMap: ${cmName} in ${namespace}`);

  const body = {
    apiVersion: "v1",
    kind: "ConfigMap",
    metadata: {
      name: cmName,
      namespace: namespace,
      ownerReferences: ownerRef,
    },
    data: {
      "index.html": htmlContent,
    },
  };

  try {
    // Attempting OBJECT-BASED call for version 1.4.0+
    await k8sApi.createNamespacedConfigMap({ namespace, body });
    console.log(`Created ConfigMap: ${cmName}`);
  } catch (err) {
    if (err.response && err.response.statusCode === 409) {
      console.log(`ConfigMap ${cmName} exists, updating...`);
      await k8sApi.replaceNamespacedConfigMap({
        name: cmName,
        namespace,
        body,
      });
      console.log(`Updated ConfigMap: ${cmName}`);
    } else {
      console.error(`Error in createConfigMap: ${err.message}`);
      // Fallback: try positional if object failed? No, let's stick to one.
    }
  }
}

async function createDeployment(namespace, name, ownerRef) {
  const deployName = `${name}-deploy`;
  console.log(`Creating Deployment: ${deployName} in ${namespace}`);

  const body = {
    apiVersion: "apps/v1",
    kind: "Deployment",
    metadata: {
      name: deployName,
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
    await k8sAppsApi.createNamespacedDeployment({ namespace, body });
    console.log(`Created Deployment: ${deployName}`);
  } catch (err) {
    if (err.response && err.response.statusCode !== 409) {
      console.error(`Error in createDeployment: ${err.message}`);
    }
  }
}

async function createService(namespace, name, ownerRef) {
  const svcName = `${name}-svc`;
  console.log(`Creating Service: ${svcName} in ${namespace}`);

  const body = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name: svcName,
      namespace: namespace,
      ownerReferences: ownerRef,
    },
    spec: {
      selector: { app: name },
      ports: [{ protocol: "TCP", port: 80, targetPort: 80 }],
    },
  };

  try {
    await k8sApi.createNamespacedService({ namespace, body });
    console.log(`Created Service: ${svcName}`);
  } catch (err) {
    if (err.response && err.response.statusCode !== 409) {
      console.error(`Error in createService: ${err.message}`);
    }
  }
}

async function reconcile(obj) {
  const namespace = obj.metadata.namespace || "default";
  const name = obj.metadata.name;
  const url = obj.spec.website_url;

  console.log(`--- Reconciling DummySite: ${name} ---`);

  const html = await fetchWebsite(url);
  const ownerRef = getOwnerReference(obj);

  await createConfigMap(namespace, name, html, ownerRef);
  await createDeployment(namespace, name, ownerRef);
  await createService(namespace, name, ownerRef);
}

function startWatch() {
  const path = `/apis/${GROUP}/${VERSION}/${PLURAL}`;
  console.log(`Watching for events at: ${path}`);

  watch.watch(
    path,
    {},
    (type, obj) => {
      if (type === "ADDED" || type === "MODIFIED") {
        reconcile(obj).catch((err) => console.error("Reconcile error:", err));
      }
    },
    (err) => {
      if (err) console.error("Watch error:", err);
      setTimeout(startWatch, 1000);
    }
  );
}

startWatch();
