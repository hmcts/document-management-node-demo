variable "product" {
    type = "string"
    default = "dm"
    description = "The name of your application"
}

variable "app_name" {
    default = "show"
}

variable "app_type" {
    default = "web"
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
variable "idam_api_url" {
    default = "http://betaDevBccidamAppLB.reform.hmcts.net:80"
}

variable "s2s_url" {
    default = "http://betaDevBccidamS2SLB.reform.hmcts.net:80"
}
variable "idam_login_url" {
    default = "https://idam-test.dev.ccidam.reform.hmcts.net/login"
}

variable "em_viewer_web_url" {
    default = "em-viewer-web"
}
variable "dm_gw_web_url" {
    default = "dm-api-gw-web"
}
variable "dm_store_app_url" {
    default = "dm-store-app"
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
variable "user_group_a_name" {
    default = "Group A"
}
variable "user_group_b_name" {
    default = "Group B"
}
variable "user_group_c_name" {
    default = "Group C"
}
variable "user_group_a_users" {
    default = "user1a@test.com"
}
variable "user_group_b_users" {
    default = "user1b@test.com"
}
variable "user_group_c_users" {
    default = "user1c@test.com"
}
