from rest_framework.response import Response
from rest_framework import status

class BlockUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        user = request.user
        if user.is_authenticated and user.is_blocked:
            return Response({'detail' : "User is blocked"}, status=status.HTTP_403_FORBIDDEN)
        return self.get_response(request)