from channels import include


channel_routing = [
    include("apps.messaging.routing.websocket_routing", path=r"^/chat/stream"),
    include("apps.messaging.routing.custom_routing"),
]
