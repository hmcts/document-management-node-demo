variable "product" {
  type = "string"
}

variable "shared_product_name" {
    default = "rpa"
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
}

variable "subscription" {
  type = "string"
}

variable "ilbIp"{}

variable "tenant_id" {}

variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "common_tags" {
  type = "map"
}

////////////////////////////////////////////////
//Addtional Vars ///////////////////////////////
////////////////////////////////////////////////
variable "capacity" {
  default = "1"
}

////////////////////////////////////////////////
// Endpoints
////////////////////////////////////////////////
variable "vault_section" {
  default = "test"
}

variable "idam_api_url" {
    default = "http://betaDevBccidamAppLB.reform.hmcts.net:80"
}

variable "idam_login_url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net/login"
}

variable "s2s_url" {
  default = "rpe-service-auth-provider"
}

variable "dm_store_app_url" {
    default = "dm-store"
}

variable "em_anno_app_url" {
    default = "em-anno"
}

variable "em_rpa_app_url" {
    default = "em-rpa"
}

variable "dg_docassembly_api_url" {
    default = "dg-docassembly-api"
}
