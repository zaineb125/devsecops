resource "azurerm_resource_group" "example" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_group" "front_end" {
  name                = var.front_end_container_name
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  os_type             = "Linux"

  container {
    name   = var.front_end_container_name
    image  = var.front_end_image
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  ip_address_type = "public"
  dns_name_label  = var.front_end_container_name
}

resource "azurerm_container_group" "back_end" {
  name                = var.back_end_container_name
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  os_type             = "Linux"

  container {
    name   = var.back_end_container_name
    image  = var.back_end_image
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }
  }

  ip_address_type = "public"
  dns_name_label  = var.back_end_container_name
}
