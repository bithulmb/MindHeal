from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.views import APIView
from .serializers import ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from .models import Complaint,ComplaintStatusChoices
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
import logging

logger = logging.getLogger(__name__)
# Create your views here.

class CreateComplaintView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Invalid data for complaint creation")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ComplaintPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class ListComplaintsView(ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated] 
    pagination_class = ComplaintPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']

    def get_queryset(self):
        if self.request.user.is_staff:  
            return Complaint.objects.all().order_by('-created_at')
        else:
            return Complaint.objects.filter(user=self.request.user).order_by('-created_at')



class ResolveComplaintView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, complaint_id):
        try:
            complaint = Complaint.objects.get(id=complaint_id)
            complaint.resolution_message = request.data.get('resolution_message')
            complaint.resolved_at = now()
            complaint.status = ComplaintStatusChoices.RESOLVED
            complaint.save()
            return Response({"message": "Complaint resolved successfully"})
        except Complaint.DoesNotExist:
            logger.error("Complaint not found")
            return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)