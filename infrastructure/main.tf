provider "azurerm" {
  version = "1.21"
}

locals {
  app_full_name = "${var.product}-${var.component}"
  ase_name = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  shared_vault_name = "${var.shared_product_name}-${local.local_env}"
}
# "${local.ase_name}"
# "${local.app_full_name}"
# "${local.local_env}"

module "app" {
  source = "git@github.com:hmcts/cnp-module-webapp?ref=master"
  product = "${local.app_full_name}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  subscription = "${var.subscription}"
  capacity     = "${var.capacity}"
    is_frontend = "${!(var.env == "preview" || var.env == "spreview") ? 1 : 0}"
    additional_host_name = "${!(var.env == "preview" || var.env == "spreview") ? "${local.app_full_name}-${var.env}.service.${var.env}.platform.hmcts.net" : "null"}"
  https_only="false"
  common_tags  = "${var.common_tags}"
  asp_rg = "${var.shared_product_name}-${var.env}"
  asp_name = "${var.shared_product_name}-anno-${var.env}"

  app_settings = {
    # REDIS_HOST = "${module.redis-cache.host_name}"
    # REDIS_PORT = "${module.redis-cache.redis_port}"
    # REDIS_PASSWORD = "${module.redis-cache.access_key}"
    # RECIPE_BACKEND_URL = "http://rhubarb-recipe-backend-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
    WEBSITE_NODE_DEFAULT_VERSION = "8.11.1"

    NODE_ENV = "${var.env}"
    # PORT = "8080"

    # logging vars & healthcheck
    REFORM_SERVICE_NAME = "${local.app_full_name}"
    REFORM_TEAM = "${var.team_name}"
    REFORM_SERVICE_TYPE = "${var.app_language}"
    REFORM_ENVIRONMENT = "${var.env}"

    PACKAGES_NAME = "${local.app_full_name}"
    PACKAGES_PROJECT = "${var.team_name}"
    PACKAGES_ENVIRONMENT = "${var.env}"

    DM_STORE_APP_URI= "http://${var.dm_store_app_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
    EM_ANNO_APP_URI="http://${var.em_anno_app_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
    EM_NPA_APP_URI="http://${var.em_npa_app_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
    DG_DOCASSEMBLY_API_URI="http://${var.dg_docassembly_api_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"

    DM_UPLOAD_URL="/demproxy/dm/documents"
    DM_OWNED_URL="/demproxy/dm/documents/owned"
    DM_SEARCH_URL="/demproxy/dm/documents/filter"

    IDAM_LOGIN_URL = "${var.idam_login_url}"
    IDAM_USER_BASE_URI = "${var.idam_api_url}"
    IDAM_S2S_BASE_URI = "http://${var.s2s_url}-${local.local_env}.service.core-compute-${local.local_env}.internal"
    IDAM_SERVICE_KEY = "${data.azurerm_key_vault_secret.s2s_secret.value}"
    IDAM_SERVICE_NAME = "em_gw"
    IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_WEBSHOW = "${data.azurerm_key_vault_secret.oauth2_secret.value}"
    IDAM_SECRET = "${data.azurerm_key_vault_secret.oauth2_secret.value}"

    HTTP_PROTOCOL = "https"
  }
}

data "azurerm_key_vault" "key_vault" {
    name = "${local.shared_vault_name}"
    resource_group_name = "${local.shared_vault_name}"
}

data "azurerm_key_vault_secret" "s2s_secret" {
    name = "em-s2s-token"
    vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "oauth2_secret" {
    name = "show-oauth2-token"
    vault_uri = "${data.azurerm_key_vault.key_vault.vault_uri}"
}

provider "vault" {
  address = "https://vault.reform.hmcts.net:6200"
}
