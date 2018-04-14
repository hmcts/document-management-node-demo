variable "product" {
  type = "string"
}

variable "component" {
  type = "string"
}

variable "team_name" {
    default = "evidence"
}

variable "app_language" {
    default = "node"
}

variable "location" {
    type = "string"
    default = "UK South"
}

variable "env" {
    type = "string"
    description = "(Required) The environment in which to deploy the application infrastructure."
}

variable "subscription" {
    type = "string"
}

variable "ilbIp"{

}

variable "tenant_id" {

}

variable "jenkins_AAD_objectId" {
    type                        = "string"
    description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

////////////////////////////////////////////////
//Addtional Vars ///////////////////////////////
////////////////////////////////////////////////

////////////////////////////////////////////////
// Endpoints
////////////////////////////////////////////////

variable "vault_section" {
  default = "test"
}

variable "idam_api_url" {
    default = "http://betaDevBccidamAppLB.reform.hmcts.net:80"
}

variable "s2s_url" {
  //  default = "http://betaDevBccidamS2SLB.reform.hmcts.net:80"
  default = "rpe-service-auth-provider"
}


variable "idam_login_url" {
    default = "https://idam-test.dev.ccidam.reform.hmcts.net/login"
}

variable "dm_store_app_url" {
    default = "dm-store"
}
variable "em_anno_app_url" {
    default = "em-anno"
}
variable "em_redact_app_url" {
    default = "em-redact"
}

////////////////////////////////////////////////
// Logging
////////////////////////////////////////////////
variable "root_appender" {
    default = "JSON_CONSOLE"
}

variable "json_console_pretty_print" {
    default = "false"
}

variable "log_output" {
    default = "single"
}

////////////////////////////////////////////////
// Toggle Features
////////////////////////////////////////////////

////////////////////////////////////////////////
//// Whitelists
////////////////////////////////////////////////

////////////////////////////////////////////////
// Addtional
////////////////////////////////////////////////
variable "idam_service_name" {
  default = "em_gw"
}
