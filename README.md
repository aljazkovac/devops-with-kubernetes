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

---

#### Exercise 4.3: Prometheus

The query: `sum(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})`

---
