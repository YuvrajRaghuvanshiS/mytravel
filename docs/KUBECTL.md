## 📘 Useful `kubectl` Commands for Working with the `test-network` Namespace in Hyperledger Fabric

### 🔍 **Inspecting Kubernetes Resources**

```bash
# List all pods in the test-network namespace
kubectl -n test-network get pods

# List all services in the test-network namespace
kubectl -n test-network get svc

# List all configmaps
kubectl -n test-network get configmap

# List a specific configmap and extract it to a file
kubectl -n test-network get configmap fabric-rest-sample-config -o jsonpath='{.data}' > ../customer-backend/configmap.json

# Get endpoint details for the org1 CA
kubectl -n test-network get endpoints org1-ca
```

---

### 🔧 **Port Forwarding**

```bash
# Forward port 7050 to access the orderer service locally
kubectl -n test-network port-forward svc/org0-orderer1 7050:7050

# Forward org1 CA service to access it via localhost:8443
kubectl -n test-network port-forward svc/org1-ca 8443:443 &

# Forward org1-peer2 to access peer's chaincode endpoint
kubectl port-forward -n test-network svc/org1-peer2 7052:7051 &
```

> ℹ️ Use these when you need to access Fabric services locally from your backend or testing scripts.

---

### 📄 **Viewing Logs and Debugging**

```bash
# View logs of a specific CCAAS (chaincode as a service) pod
kubectl -n test-network logs org1peer1-ccaas-chaincode-f95475dd8-h5q5l

# View logs of org1 peer1 pod
kubectl -n test-network logs org1-peer1-7b87f585db-kj67s
```

---

### 🚫 **Managing Pods**

```bash
# Delete a specific pod (e.g., to force restart it)
kubectl -n test-network delete pod fabric-rest-sample-55d555fccf-tt9gn
```

---

### 💻 **Executing Commands Inside Pods**

```bash
# List all channels the peer has joined
kubectl -n test-network exec org1-peer1-7b87f585db-tw945 -- peer channel list

# Get information about a specific channel
kubectl -n test-network exec org1-peer1-7b87f585db-tw945 -- peer channel -c mychannel info

# Alternative command to get channel info (general)
kubectl -n test-network exec org1-peer1-7b87f585db-tw945 -- peer channel getinfo

# Get TLS certificate from inside the peer container
kubectl -n test-network exec org1-peer1-7b87f585db-24mpm -- cat /var/hyperledger//fabric/config/tls/tls.crt
```

---

### ⏳ **Waiting for Resources to be Ready**

```bash
# Wait for the NGINX ingress controller to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=2m
```

---

### 🧩 Additional Helpful Commands

```bash
# Describe a specific pod for deeper debugging
kubectl -n test-network describe pod <pod-name>

# Watch resource changes in real-time
kubectl -n test-network get pods --watch
```
