variable "location" {
  description = "Azure region to deploy the resources"
  default     = "West Europe"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "front_end_container_name" {
  description = "Name of the front-end container"
  type        = string
}

variable "back_end_container_name" {
  description = "Name of the back-end container"
  type        = string
}

variable "front_end_image" {
  description = "Docker image for the front-end"
  type        = string
}

variable "back_end_image" {
  description = "Docker image for the back-end"
  type        = string
}
