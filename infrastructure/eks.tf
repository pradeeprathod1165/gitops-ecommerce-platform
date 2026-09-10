module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "ecommerce-gitops-cluster"
  cluster_version = "1.34"

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    general = {
      name         = "general-nodes"
      min_size     = 1
      max_size     = 4
      desired_size = 3

      # Upgrade to 2GB RAM to support Argo CD + Your App
      instance_types = ["t3.small"]
      capacity_type  = "ON_DEMAND"

      ami_type = "AL2023_x86_64_STANDARD"

      cloudinit_pre_nodeadm = [
        {
          content_type = "application/node.eks.aws"
          content      = <<-EOT
          ---
          apiVersion: node.eks.aws/v1alpha1
          kind: NodeConfig
          spec:
            kubelet:
              config:
                maxPods: 28
        EOT
        }
      ]
    }
  }
  tags = {
    Environment = "dev"
    Project     = "gitops-ecommerce"
  }
}
