# MyTravel.com Hyperledger Fabric Network

This component provides the blockchain infrastructure for the MyTravel.com ticket booking system using Hyperledger Fabric running on Kubernetes.

## Overview

The network is based on the [Hyperledger Fabric Kubernetes Test Network](https://github.com/hyperledger/fabric-samples/tree/main/test-network-k8s) with customizations for the ticket booking use case. It provides a distributed ledger for securely recording all ticket transactions.

## Architecture

The network consists of:

- **Ordering Service**: 3-node Raft consensus
- **Organizations**:
  - Org0: Operates ordering service
  - Org1: Travel agencies
  - Org2: Customers
- **Certificate Authorities (CAs)**: One per organization
- **Peers**: 2 peers per organization for redundancy
- **Channels**: A single application channel for ticket transactions
- **Chaincode**: Travel booking smart contracts

## Prerequisites

- Kubernetes cluster (minikube, kind, or cloud-based)
- kubectl CLI
- Docker
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mytravel-blockchain.git
cd mytravel-blockchain/mytravel-k8s
```

### 2. Install prerequisites

Run the prerequisites script to verify your environment:

```bash
./cloud_prerequisites.sh
```

### 3. Create KIND cluster

```bash
./network kind
./network cluster init
```

This will:

- Create Kubernetes namespaces

### 4. Launch the network, create a channel:

```bash
./network up
./network channel create
```

This will:

- Deploy Certificate Authorities
- Enroll network administrators
- Deploy ordering service nodes
- Deploy peers
- Create the application channel
- Join peers to the channel

### 5. Deploy the Chaincode

```bash
./network chaincode deploy chaincode chaincode/
```

### 6. Deploy the REST API

```bash
./network rest-easy
```

### 7. Stop the Network

```bash
./network down
./network unkind
```

This will:

- Delete Kubernetes namespaces
- Delete Kubernetes confimaps
- Tear down the network

### 8. Reset the Network

```bash
./reset
```

This will:

- Delete Kubernetes namespaces
- Delete Kubernetes confimaps
- Tear down the network
- Run commands 1 through 6

## Network Management Commands

### View Network Pods

```bash
kubectl -n test-network get pods
```

### View Logs of a Pod

```bash
kubectl -n test-network logs <pod-name>
```

> Full list of network commands is available [here](docs/KUBECTL.md)

## Configuration Files

- **config/**: Contains configuration for each organization
- **kube/**: Contains Kubernetes deployment files
- **build/**: Contains generated certificates and connection profiles

## Troubleshooting

### Common Issues

1. **Pods stuck in pending state**: Check for resource constraints or persistent volume claims

   ```bash
   kubectl -n test-network describe pod
   ```

2. **Certificate errors**: Check CA logs

   ```bash
   kubectl -n test-network logs org1-ca-0
   ```

3. **Connection issues**: Verify network policies and service endpoints
   ```bash
   kubectl -n test-network get svc
   ```

### Debugging Tools

Use the network-debug.log file for detailed logs:

```bash
cat network-debug.log
```

## Additional Resources

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- See [docs/KUBECTL.md](./docs/KUBECTL.md) for Kubernetes commands specifically for this project
