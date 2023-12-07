resource "azurerm_resource_group" "example" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_group" "back_end" {
  name                = "mern-api"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  os_type             = "Linux"
  container {
    name   = "mern-api"
    image  = "malekghorbel/mern-api"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 80
      protocol = "TCP"
    }
  }
  ip_address_type = "Public"
  dns_name_label  = "mern-api"
}

resource "azurerm_container_group" "front_end" {
  name                = "mern-ui"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  os_type             = "Linux"
  container {
    name   = "mern-ui"
    image  = "malekghorbel/mern-ui"
    cpu    = "0.5"
    memory = "1.5"
    ports {
      port     = 80
      protocol = "TCP"
    }
  }
  ip_address_type = "Public"
  dns_name_label  = "mern-ui"
}
