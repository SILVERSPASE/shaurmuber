from aiohttp import web
from .views import notification_handler

urls = [
    ['/async/', notification_handler]
]
