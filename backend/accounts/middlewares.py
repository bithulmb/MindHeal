from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse

# class BlockUserMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response
    
#     def __call__(self, request):
#         user = request.user
#         print("inside middlware", request.user.is_authenticated, request.user)
#         if user.is_authenticated and user.is_blocked:
#             print("inside middlware1")
#             return Response({'detail' : "User is blocked"}, status=status.HTTP_403_FORBIDDEN)
#         return self.get_response(request)
    
class BlockUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):

        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            jwt_auth = JWTAuthentication()
            try:
                validated_token = jwt_auth.get_validated_token(token)
                user = jwt_auth.get_user(validated_token)
                if user.is_authenticated and user.is_blocked:
                    print("Blocked user detected")
                    return JsonResponse({'detail' : "User is blocked"}, status=403)
            except Exception as e:
                print("JWT Error:", str(e))
        
        return self.get_response(request)       

        