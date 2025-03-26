from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.middleware import BaseMiddleware
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class JwtAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using JWT tokens.
    Expects the token to be passed in the query string, e.g., ws://domain/ws/chat/<thread_id>/?token=<jwt_token>
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Extract query string from scope
        query_string = scope.get("query_string", b"").decode("utf-8")
        token = self._get_token_from_query_string(query_string)

        # Set default user as AnonymousUser
        scope["user"] = AnonymousUser()
        print("anonymouse")

        if token:
            try:
                # Validate the token and get the user
                user = await self._get_user_from_token(token)
                if user is not None:
                    scope["user"] = user
            except (InvalidToken, TokenError) as e:

                logger.error(f"Invalid JWT token: {str(e)}")
            except Exception as e:
                logger.error(f"Error processing JWT token: {str(e)}")

        # Call the next layer (consumer)
        return await self.inner(scope, receive, send)

    def _get_token_from_query_string(self, query_string):
        """Extract the token from the query string."""
        if not query_string:
            return None
        params = dict(qp.split("=") for qp in query_string.split("&") if "=" in qp)
        return params.get("token", None)

    @database_sync_to_async
    def _get_user_from_token(self, token):
        """Validate the JWT token and return the associated user."""
        try:
            # Validate the token
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            # Fetch the user from the database
            return User.objects.get(id=user_id)
        except (InvalidToken, TokenError, User.DoesNotExist):
            return None