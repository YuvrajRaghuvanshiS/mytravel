#!/bin/bash

set -e

echo "Updating package list..."
sudo apt update

##############################
# Docker Installation
##############################

echo "Removing old Docker versions (if any)..."
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do 
    sudo apt-get remove -y $pkg
done

echo "Installing prerequisites..."
sudo apt-get install -y ca-certificates curl

echo "Adding Docker's official GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "Adding Docker repository..."
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "Installing Docker..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

##############################
# kubectl Installation
##############################

echo "Installing kubectl..."
KUBECTL_ARCH=$(uname -m)
if [ "$KUBECTL_ARCH" = "aarch64" ]; then
    KUBECTL_ARCH="arm64"
elif [ "$KUBECTL_ARCH" = "x86_64" ]; then
    KUBECTL_ARCH="amd64"
fi
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/${KUBECTL_ARCH}/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

##############################
# Additional Tools
##############################

echo "Installing jq..."
sudo apt-get install -y jq

echo "Installing envsubst (gettext-base)..."
sudo apt-get install -y gettext-base

##############################
# kind Installation
##############################

echo "Installing kind..."
KIND_ARCH=$(uname -m)
if [ "$KIND_ARCH" = "x86_64" ]; then
    KIND_URL="https://kind.sigs.k8s.io/dl/v0.27.0/kind-linux-amd64"
elif [ "$KIND_ARCH" = "aarch64" ]; then
    KIND_URL="https://kind.sigs.k8s.io/dl/v0.27.0/kind-linux-arm64"
else
    echo "Unsupported architecture: $KIND_ARCH"
    exit 1
fi

curl -Lo kind $KIND_URL
chmod +x kind
sudo mv kind /usr/local/bin/kind

echo "Setup completed successfully."
