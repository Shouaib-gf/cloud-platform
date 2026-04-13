#!/bin/bash

set -e

VM_NAME=$1
VM_ID=$2
CPU=$3
RAM=$4
DISK=$5

BASE_DIR="/opt/cloud-platform"
TEMPLATE_DIR="$BASE_DIR/template"
DEPLOY_DIR="$BASE_DIR/deployments/$VM_NAME"

echo "========== START DEPLOY =========="

echo "VM_NAME=$VM_NAME"
echo "VM_ID=$VM_ID"
echo "CPU=$CPU RAM=$RAM DISK=$DISK"

# 🧹 Create clean deployment directory
echo "Creating deployment directory..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# 📂 Copy Terraform template
echo "Copying terraform template..."
cp "$TEMPLATE_DIR/"*.tf "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"

# ⚙️ Terraform init
echo "Initializing terraform..."
terraform init -input=false

# 🚀 Terraform apply
echo "Applying terraform..."
terraform apply -auto-approve \
  -var="vm_name=$VM_NAME" \
  -var="vm_id=$VM_ID" \
  -var="cpu_cores=$CPU" \
  -var="ram=$RAM" \
  -var="disk_size=$DISK"

# ⏳ Wait for VM to fully boot
echo "Waiting for VM to boot (30s)..."
sleep 30

# 🌐 Get VM IP (robust extraction)
echo "Getting VM IP..."

RAW_OUTPUT=$(terraform output vm_ip || true)

VM_IP=$(echo "$RAW_OUTPUT" | grep -oE '192\.168\.[0-9]+\.[0-9]+' | head -1)

# ❌ If no IP → fail clearly
if [ -z "$VM_IP" ]; then
  echo "❌ ERROR: Could not detect VM IP"
  echo "Terraform output was:"
  echo "$RAW_OUTPUT"
  exit 1
fi

echo "✅ Detected VM IP: $VM_IP"

# ⏳ Wait for SSH readiness
echo "Waiting for SSH to be ready..."

for i in {1..20}; do
  if nc -z "$VM_IP" 22; then
    echo "SSH is ready ✅"
    break
  fi
  echo "Retry $i..."
  sleep 5
done

# 📄 Update Ansible inventory
echo "Updating inventory..."

cat > "$BASE_DIR/ansible/inventory.ini" <<EOF
[managed]
$VM_IP ansible_user=cloud ansible_password=123456
EOF

# 🔐 Clean old SSH key
echo "Cleaning old SSH key..."
ssh-keygen -f "/var/lib/jenkins/.ssh/known_hosts" -R "$VM_IP" 2>/dev/null || true

# ⚙️ Run Ansible
echo "Running Ansible..."
cd "$BASE_DIR/ansible"

ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini setup.yml

echo "========== DEPLOYMENT COMPLETE =========="
