# 🛒 Cloud-Native GitOps E-Commerce Platform

[![AWS EKS](https://img.shields.io/badge/AWS-EKS%201.34-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/eks/)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Argo CD](https://img.shields.io/badge/GitOps-Argo%20CD-EF7B4D?logo=argo&logoColor=white)](https://argo-cd.readthedocs.io/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Container-Docker%20Node%2020-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, cloud-native microservice deployment built on **AWS EKS**, managed via **Infrastructure as Code (Terraform)**, and reconciled continuously with a **GitOps pipeline (Argo CD & GitHub Actions)**.

---

## 📌 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Tech Stack](#-tech-stack)
- [Key Features & Engineering Highlights](#-key-features--engineering-highlights)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Step-by-Step Deployment Guide](#-step-by-step-deployment-guide)
  - [1. Infrastructure Provisioning](#1-infrastructure-provisioning-terraform)
  - [2. Cluster Authentication & Kubeconfig](#2-cluster-authentication--kubeconfig)
  - [3. Registry Credentials Configuration](#3-registry-credentials-configuration)
  - [4. Continuous Delivery via Argo CD](#4-continuous-delivery-via-argo-cd)
- [Local Verification & Testing](#-local-verification--testing)
- [Teardown & Cost Management](#-teardown--cost-management)
- [Lessons Learned & Troubleshooting](#-lessons-learned--troubleshooting)

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
