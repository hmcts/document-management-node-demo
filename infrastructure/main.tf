locals {
  app_full_name = "${var.product}-${var.app_name}-${var.app_type}"
  ase_name = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"
}
# "${local.ase_name}"
# "${local.app_full_name}"

module "app" {
  source = "git@github.com:contino/moj-module-webapp?ref=master"
  product = "${local.app_full_name}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"

  app_settings = {
    # REDIS_HOST = "${module.redis-cache.host_name}"
    # REDIS_PORT = "${module.redis-cache.redis_port}"
    # REDIS_PASSWORD = "${module.redis-cache.access_key}"
    # RECIPE_BACKEND_URL = "http://rhubarb-recipe-backend-${var.env}.service.${data.terraform_remote_state.core_apps_compute.ase_name[0]}.internal"
    WEBSITE_NODE_DEFAULT_VERSION = "8.8.0"

    # NODE_ENV = "${var.env}"
    # PORT = "8080"

    # logging vars & healthcheck
    REFORM_SERVICE_NAME = "${local.app_full_name}"
    REFORM_TEAM = "${var.team_name}"
    REFORM_SERVICE_TYPE = "${var.app_language}"
    REFORM_ENVIRONMENT = "${var.env}"

    PACKAGES_NAME = "${local.app_full_name}"
    PACKAGES_PROJECT = "${var.team_name}"
    PACKAGES_ENVIRONMENT = "${var.env}"

    ROOT_APPENDER = "${var.root_appender}"
    JSON_CONSOLE_PRETTY_PRINT = "${var.json_console_pretty_print}"
    LOG_OUTPUT = "${var.log_output}"

    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_LOGIN_URL = "${var.idam_login_url}"
    IDAM_CONTINUE_URL = "http://${local.app_full_name}-${var.env}.service.${local.ase_name}.internal"
    DM_UPLOAD_URL = "http://${var.dm_gw_web_url}-${var.env}.service.${local.ase_name}.internal/documents"
    DM_OWNED_URL = "http://${var.dm_gw_web_url}-${var.env}.service.${local.ase_name}.internal/documents/owned"
    DM_SEARCH_URL = "http://${var.dm_gw_web_url}-${var.env}.service.${local.ase_name}.internal/documents/filter"
    DM_VIEWER_URL = "http://${var.em_viewer_web_url}-${var.env}.service.${local.ase_name}.internal"
    USER_GROUP_A = "${var.user_group_a_name}"
    USER_GROUP_B = "${var.user_group_b_name}"
    USER_GROUP_C = "${var.user_group_c_name}"
    USER_GROUP_A_USERS = "${var.user_group_a_users}"
    USER_GROUP_B_USERS = "${var.user_group_b_users}"
    USER_GROUP_C_USERS = "${var.user_group_c_users}"
  }
}

module "key_vault" {
  source = "git@github.com:contino/moj-module-key-vault?ref=master"
  product = "${local.app_full_name}"
  env = "${var.env}"
  tenant_id = "${var.tenant_id}"
  object_id = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${module.app.resource_group_name}"
  product_group_object_id = "5d9cd025-a293-4b97-a0e5-6f43efce02c0"
}

# module "redis-cache" {
# source = "git@github.com:contino/moj-module-redis?ref=master"
# product = "${var.product}"
# location = "${var.location}"
# env = "${var.env}"
# subnetid = "${data.terraform_remote_state.core_apps_infrastructure.subnet_ids[2]}"
# }
