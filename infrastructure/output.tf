output "microserviceName" {
  value = "${local.app_full_name}"
}

output "vaultName" {
    value = "${local.shared_vault_name}"
}

output "vaultUri" {
  value = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

output "idam_api_url" {
  value = "${var.idam_api_url}"
}

output "s2s_url" {
  value = "http://${var.s2s_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
}

output "dm_store_app_url" {
  value = "http://${var.dm_store_app_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
}

output "em_anno_app_url" {
  value = "http://${var.em_anno_app_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
}