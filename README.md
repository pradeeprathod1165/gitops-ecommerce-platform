# 🛒 Cloud-Native GitOps E-Commerce Platform

[![AWS EKS](https://img.shields.io/badge/AWS-EKS%201.34-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/eks/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Argo CD](https://img.shields.io/badge/GitOps-Argo%20CD-EF7B4D?logo=argo&logoColor=white)](https://argo-cd.readthedocs.io/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Container-Docker%20Node%2020-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade, cloud-native microservice deployment built on **AWS EKS**, managed via **Infrastructure as Code (Terraform)**, and reconciled continuously with a **GitOps pipeline (Argo CD & GitHub Actions)**.

---

## 🏗 Architectural Overview

```text
[ Developer ]
      │
      │ 1. git push origin main
      ▼
┌────────────────────────────────────────────────────────┐
│ GitHub Repository                                     │
│  ├── .github/workflows/docker-build.yml ─────────────┐ │
│  ├── k8s/ (Deployment & Service Manifests)           │ │
│  └── terraform/ (AWS Infrastructure)                 │ │
└──────────────────────────────────────────────────────┬─┘
                                                       │ 2. Triggers CI Build
                                                       ▼
                                            ┌─────────────────────┐
                                            │ GitHub Actions      │
                                            │ (Docker Build/Push) │
                                            └──────────┬──────────┘
                                                       │
                                                       │ 3. Push Image
                                                       ▼
                                            ┌─────────────────────┐
                                            │ GitHub Container    │
                                            │ Registry (GHCR)     │
                                            └──────────┬──────────┘
                                                       │
┌───────────────────────── AWS Cloud ──────────────────┼─────────────────────────┐
│                                                      │                         │
│   ┌─────────────────── VPC (ecommerce-gitops-vpc) ───┼─────────────────────┐   │
│   │                                                  │                     │   │
│   │   ┌──────────────── Argo CD ─────────────────┐   │ 5. Pull Image       │   │
│   │   │  - Reconciles state from Git (k8s/)      │   │    (via Secret)     │   │
│   │   │  - Auto-syncs to EKS Cluster             │   │                     │   │
│   │   └──────────────────────┬───────────────────┘   │                     │   │
│   │                          │ 4. Apply Manifests    │                     │   │
│   │                          ▼                       ▼                     │   │
│   │   ┌────────────────────────────────────────────────────────────────┐   │   │
│   │   │ AWS EKS Cluster (ecommerce-gitops-cluster)                    │   │   │
│   │   │ Managed Node Group: t3.small                                  │   │   │
│   │   │                                                                │   │   │
│   │   │   ┌─────────────── k8s Namespace: default ─────────────────┐   │   │   │
│   │   │   │                                                        │   │   │   │
│   │   │   │  [ Service ] (ClusterIP: 80 ➔ TargetPort: 8080)        │   │   │   │
│   │   │   │       ▲                                                │   │   │   │
│   │   │   │       │ Routing                                        │   │   │   │
│   │   │   │  [ Deployment: ecommerce-backend ]                     │   │   │   │
│   │   │   │       └─ Pod: Node.js Alpine (Port 8080)               │   │   │   │
│   │   │   │          └── Modern HTML/CSS Storefront UI             │   │   │   │
│   │   │   └────────────────────────────────────────────────────────┘   │   │   │
│   │   └────────────────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────┘
                                  ▲
                                  │ kubectl port-forward
                                  │
                          [ Local Browser ]
                          http://localhost:3000
```

---

## 💻 Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Cloud Provider** | AWS | Hosting VPC, subnets, NAT Gateways, IAM, and managed compute |
| **Infrastructure as Code** | Terraform | Automated provisioning of VPC and EKS infrastructure |
| **Container Orchestration** | AWS EKS (Kubernetes 1.34) | Container scheduling, self-healing, networking, and secret handling |
| **GitOps Engine** | Argo CD | Declarative continuous delivery and state synchronization from Git |
| **CI / Automation** | GitHub Actions | Automated image building and pushing to container registry |
| **Artifact Registry** | GitHub Container Registry (GHCR) | Secure private container registry for application packages |
| **Container Runtime** | Docker (`node:20-alpine`) | Lightweight container runtime and packaging |
| **Application Layer** | Node.js | Microservice backend serving a responsive storefront dashboard |

---

## ✨ Key Features & Engineering Highlights

* **Declarative GitOps Delivery:** All cluster state resides in Git (`k8s/`). Argo CD automatically tracks and resolves configuration drift.
* **Automated Image Lifecycle:** Pushes to `main` trigger GitHub Actions to build and push container images to GHCR.
* **Network Isolation:** Custom AWS VPC configured with dedicated public/private subnets and managed NAT Gateways.
* **Dynamic Frontend:** Responsive storefront interface with real-time health indicator badges and an inventory catalog.
* **Native Secret Management:** Registry credentials injected at runtime using Kubernetes `imagePullSecrets`.

---

## 📂 Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── docker-build.yml       # GitHub Actions CI workflow
├── k8s/
│   ├── deployment.yaml            # Deployment spec with imagePullSecrets
│   └── service.yaml               # ClusterIP service definition (Port 80 -> 8080)
├── terraform/
│   ├── main.tf                    # AWS Provider & VPC module
│   └── eks.tf                     # EKS cluster & node group definition
├── Dockerfile                     # Optimized container build
├── package.json                   # Dependencies and scripts
├── server.js                      # Microservice app code
└── README.md                      # Documentation
```

---

## ⚙️ Prerequisites

* AWS CLI configured via `aws configure`
* Terraform CLI (>= 1.5.0)
* `kubectl`
* Argo CD CLI
* Docker

---

## 🚀 Step-by-Step Deployment Guide

### 1. Infrastructure Provisioning (Terraform)
```bash
cd terraform
terraform init
terraform apply -auto-approve
```

### 2. Cluster Authentication
```bash
aws eks update-kubeconfig --region us-east-1 --name ecommerce-gitops-cluster
kubectl get nodes
```

### 3. Registry Credentials Configuration
```bash
kubectl create secret docker-registry ghcr-secret \
  --namespace=default \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<YOUR_GITHUB_PAT>
```

### 4. Continuous Delivery via Argo CD
```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Create and sync application
argocd app create ecommerce-platform \
  --repo https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git \
  --path k8s \
  --dest-server [https://kubernetes.default.svc](https://kubernetes.default.svc) \
  --dest-namespace default

argocd app sync ecommerce-platform
```

---

## 🔍 Local Verification & Testing

Verify the pods are running:
```bash
kubectl get pods -l app=ecommerce-backend
```

Port-forward traffic locally:
```bash
kubectl port-forward svc/ecommerce-backend-svc 3000:80
```
Open `http://localhost:3000` in your browser.

---

## 🧹 Teardown & Cost Management

To avoid ongoing AWS compute charges:
```bash
cd terraform
terraform destroy -auto-approve
```

---

## 💡 Key Solutions & Troubleshooting

* **ImagePullBackOff Resolution:** Handled GHCR private package access by creating an EKS-native `docker-registry` secret mapped to pod specifications.
* **Port Mapping Alignment:** Exposed container port (`8080`) matched with Kubernetes Service `targetPort: 8080` to route external traffic properly (`port: 80`).
* **Deployment Rollout Invalidation:** Used `kubectl rollout restart deployment ecommerce-backend` to bypass local node image caching when iterating quickly.
