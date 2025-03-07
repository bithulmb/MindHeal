from django.shortcuts import render
from rest_framework import generics,status,filters
from django.contrib.auth import get_user_model
from accounts.serializers import UserSerializer,PsychologistProfileSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from accounts.models import PsychologistProfile,ApprovalStatusChoices
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend 
# Create your views here.
User = get_user_model()

class UserPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = page_size
    max_page_size = 100

#api view for getting the details of the users
class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(role="Patient").order_by('-id')
    serializer_class = UserSerializer
    permission_classes=[IsAdminUser]
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email'] 



#api view for getting the details of the psychologists
class PsychologistListView(generics.ListAPIView):
    queryset = User.objects.filter(role="Psychologist").order_by('-id')
    serializer_class = UserSerializer
    permission_classes=[IsAdminUser]
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'email'] 

#api view from admin to block or unblock the user
class UserUpdateBlockStatusView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    permission_classes = [IsAdminUser]

    def patch(self,request, *args, **kwargs):
        user = self.get_object()
        is_blocked = request.data.get('is_blocked', None)

        if is_blocked is not None:
            user.is_blocked = is_blocked
            user.save()
            return Response({'message' : "User block status updated succesfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'error' : "is_blocked field is required"}, status=status.HTTP_400_BAD_REQUEST)


#api view for getting the details of the psychologist profiles
class PsychologistProfilePendingListView(generics.ListAPIView):
    queryset = PsychologistProfile.objects.filter(approval_status = "Pending")
    serializer_class = PsychologistProfileSerializer
    permission_classes=[IsAdminUser]

#api view for getting the psychologist profile and for approving or rejecting the profile
class PsychologistRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = PsychologistProfile.objects.all()
    serializer_class = PsychologistProfileSerializer
    permission_classes=[IsAdminUser]

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        action = request.data.get('action')
        if action=="approve":
            profile.approval_status = ApprovalStatusChoices.APPROVED
            profile.is_admin_verified = True
            message = "Psychologist Approved Succesfully"
        elif action == "reject":
            profile.approval_status = ApprovalStatusChoices.REJECTED
            profile.is_admin_verified = False
            message = "Psychologist rejected successfully"
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.save()
        return Response({'message' : message}, status=status.HTTP_200_OK)