output "front_end_ip" {
  value = azurerm_container_group.front_end.ip_address
}

output "back_end_ip" {
  value = azurerm_container_group.back_end.ip_address
}
