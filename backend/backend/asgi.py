"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

from chat.middlewares import JwtAuthMiddleware
import chat.routing
import notifications.routing

application = ProtocolTypeRouter({
    "http" : django_asgi_app,
    'websocket' : JwtAuthMiddleware(AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns + notifications.routing.websocket_urlpatterns,
        )
    ))
})
