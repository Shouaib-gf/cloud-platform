terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.46.0"
    }
  }
}

provider "proxmox" {
  endpoint = "https://192.168.159.148:8006/"
  username = "root@pam"
  password = "oumayma123"
  insecure = true
}

resource "proxmox_virtual_environment_vm" "vm1" {
  name      = var.vm_name
  vm_id = var.vm_id
  node_name = "pve"

  clone {
    vm_id = 9000
  }

  cpu {
    cores = var.cpu_cores
  }

  memory {
    dedicated = var.ram
  }

  network_device {
    bridge = "vmbr0"
  }

  disk {
    datastore_id = "local-lvm"
    size = var.disk_size
    interface    = "scsi0"
  }

  initialization {
    user_account {
      username = "cloud"
      password = "123456"
    }

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }
}
