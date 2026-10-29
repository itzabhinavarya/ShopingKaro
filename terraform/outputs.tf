output "alb_dns" {
  value = aws_lb.alb.dns_name
}

output "ecs_cluster" {
  value = aws_ecs_cluster.cluster.id
}

output "ecs_service" {
  value = aws_ecs_service.service.name
}

output "docdb_endpoint" {
  value = aws_docdb_cluster.cluster.endpoint
}

output "docdb_port" {
  value = aws_docdb_cluster.cluster.port
}
