# Kubernetes Commands for MyTravel.com

This document provides a reference for common kubectl commands used to manage and troubleshoot the MyTravel.com Hyperledger Fabric network running on Kubernetes.

## Basic kubectl Commands

### Checking Cluster Status

```bash
# Get cluster information
kubectl cluster-info

# View nodes in the cluster
kubectl get nodes

# Check all resources in the test-network namespace
kubectl -n test-network get all
```

### Pod Management

```bash
# List all pods in the test-network namespace
kubectl -n test-network get pods

# Get detailed information about a specific pod
kubectl -n test-network describe pod

# View logs for a pod
kubectl -n test-network logs <pod-name>

# Follow logs in real-time
kubectl -n test-network logs -f <pod-name>

# Execute a command in a pod
kubectl -n test-network exec -it -- <command>
```

### Service Management

```bash
# List all services
kubectl -n test-network get services

# Get details of a specific service
kubectl -n test-network describe service <service-name>
```

### Persistent Volume Claims

```bash
# List all PVCs
kubectl -n test-network get pvc

# Get details of a specific PVC
kubectl -n test-network describe pvc <pvc-name>
```

## Troubleshooting Commands

### Network Connectivity

```bash
# Check service endpoints
kubectl -n test-network get endpoints
```

## Configuration and Secret Management

```bash
# View ConfigMaps
kubectl -n test-network get configmaps

# View specific ConfigMap
kubectl -n test-network describe configmap <configmap-name>

# View Secrets (names only)
kubectl -n test-network get secrets
```

## Deployment Management

```bash
# Scale a deployment
kubectl -n test-network scale deployment  --replicas=<num>

# Restart a deployment
kubectl -n test-network rollout restart deployment

# Check rollout status
kubectl -n test-network rollout status deployment
```

## Cleanup Commands

```bash
# Delete a specific pod (it will be recreated if managed by a controller)
kubectl -n test-network delete pod <pod-name>
```

## Port Forwarding for Local Testing

```bash
# Forward a local port to a pod port
# Example: Forward local port 8080 to REST API port 3000
kubectl -n test-network port-forward fabric-rest-sample-0 8080:3000
```

## Additional Resources

- [Official Kubernetes Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubectl Command Reference](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
- [Kubernetes Troubleshooting Guide](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/)
