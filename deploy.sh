#!/bin/bash

echo "========== TERRAFORM APPLY =========="
cd ~/proxmox-terraform || exit
terraform apply -auto-approve

echo "========== GETTING VM IP =========="
VM_IP=$(terraform output vm_ip | grep -oE '192\.168\.[0-9]+\.[0-9]+' | head -1)

echo "Detected VM IP: $VM_IP"

echo "========== UPDATING INVENTORY =========="
cat > ~/ansible/inventory.ini <<EOF
[managed]
$VM_IP ansible_user=cloud ansible_password=123456
EOF

echo "========== RUNNING ANSIBLE =========="
cd ~/ansible || exit
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini setup.yml
