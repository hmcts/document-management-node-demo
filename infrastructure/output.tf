output "microserviceName" {
  value = "${var.product}-${var.app_name}"
}

output "vaultName" {
  value = "${module.key_vault.key_vault_name}"
}

output "vaultUri" {
  value = "${module.key_vault.key_vault_uri}"
}

output "idam_api_url" {
  value = "${var.idam_api_url}"
}

output "s2s_url" {
  value = "${var.s2s_url}"
}
