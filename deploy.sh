
#!/bin/bash
set -e

VM_NAME=$1
VM_ID=$2
CPU=$3
RAM=$4
DISK=$5

BASE_DIR=$(pwd)

DEPLOY_DIR="$BASE_DIR/deployments/$VM_NAME"

echo "Creating deployment directory..."
mkdir -p "$DEPLOY_DIR"

echo "Copying terraform template..."
cp "$BASE_DIR/template/"*.tf "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"

echo "Initializing terraform..."
terraform init

echo "Applying terraform..."
terraform apply -auto-approve \
-var="vm_name=$VM_NAME" \
-var="vm_id=$VM_ID" \
-var="cpu_cores=$CPU" \
-var="ram=$RAM" \
-var="disk_size=$DISK"

echo "Getting VM IP..."
VM_IP=$(terraform output vm_ip | grep -oE '192\.168\.[0-9]+\.[0-9]+' | head -1)

echo "Detected VM IP: $VM_IP"

echo "Waiting for VM boot..."

echo "Updating inventory..."
cat > "$BASE_DIR/ansible/inventory.ini" <<EOF
[managed]
$VM_IP ansible_user=cloud ansible_password=123456
EOF

echo "Cleaning old SSH key..."
ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "$VM_IP" || true

echo "Running Ansible..."
cd "$BASE_DIR/ansible"

ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini setup.yml
