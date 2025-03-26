from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatThread, ChatMessage
from .serializers import ChatThreadSerializer, ChatMessageSerializer
from django.contrib.auth import get_user_model
from accounts.models import PatientProfile,PsychologistProfile
from rest_framework.exceptions import PermissionDenied

User = get_user_model()


class ChatThreadView(generics.GenericAPIView):     
    """Fetch or create a chat thread for a user and psychologist"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        psychologist_id = request.query_params.get("psychologist_id")

        if not user_id or not psychologist_id:
            return Response({"error": "Missing user_id or psychologist_id"}, status=400)

        try:
            user = PatientProfile.objects.get(id=user_id)
            psychologist = PsychologistProfile.objects.get(id=psychologist_id)
        except (PatientProfile.DoesNotExist, PsychologistProfile.DoesNotExist):
            return Response({"error": "Invalid user or psychologist"}, status=404)
        
        # Check if the requesting user is either the patient or psychologist
        if request.user != user.user and request.user != psychologist.user:
            return Response({"error": "You are not authorized to access this thread"}, status=403)
        
        # Create new thread
        chat_thread, created = ChatThread.objects.get_or_create(user=user, psychologist=psychologist)

        return Response({"thread_id": chat_thread.id, "created": created})


class ChatMessageView(generics.ListCreateAPIView):
    """Fetch all messages in a chat thread or send a new message"""
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        """Get messages for the specified chat thread"""
        thread_id = self.kwargs['thread_id']
        thread = ChatThread.objects.get(id=thread_id)

        # Authorization check
        if self.request.user != thread.user.user and self.request.user != thread.psychologist.user:
            raise PermissionDenied("You are not authorized to view this chat thread")
        
        return ChatMessage.objects.filter(thread_id=thread_id).order_by('timestamp')

    def perform_create(self, serializer):
        """Save new chat messages"""
        thread_id = self.kwargs['thread_id']
        thread = ChatThread.objects.get(id=thread_id)

        # Authorization check
        if self.request.user != thread.user.user and self.request.user != thread.psychologist.user:
            raise PermissionDenied("You are not authorized to send messages in this chat thread")
        
        serializer.save(sender=self.request.user, thread_id=thread_id)

class GetChatThreadsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatThreadSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = ChatThread.objects.none()
        if user.role == "Patient":
            queryset = ChatThread.objects.filter(user__user=user)
        elif user.role == "Psychologist":
            queryset = ChatThread.objects.filter(psychologist__user=user)
        return queryset