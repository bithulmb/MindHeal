from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import PatientProfile, PsychologistProfile

User = get_user_model()



class ChatThread(models.Model):
    """A persistent chat thread between a user and a psychologist"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_threads")
    psychologist = models.ForeignKey(User, on_delete=models.CASCADE, related_name="psychologist_threads")

    def __str__(self):
        return f"Chat between {self.user.first_name} and {self.psychologist.first_name}"
    



class ChatMessage(models.Model):
    """Stores chat messages in the thread"""
    thread = models.ForeignKey(ChatThread, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.first_name}: {self.message[:30]}"