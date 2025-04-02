from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import PatientProfile, PsychologistProfile

User = get_user_model()



class ChatThread(models.Model):
    """A persistent chat thread between a user and a psychologist"""
    user = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name="chat_threads")
    psychologist = models.ForeignKey(PsychologistProfile, on_delete=models.CASCADE, related_name="psychologist_threads")

    def __str__(self):
        return f"Chat between {self.user.user.first_name} and {self.psychologist.user.first_name}"
    



class ChatMessage(models.Model):
    """Stores chat messages in the thread"""
    thread = models.ForeignKey(ChatThread, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name='sender_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True,related_name='reciever_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.first_name}: {self.message[:30]}"
    
    #to automatically save the reciever based on thread 
    def save(self,*args,**kwargs):
        if not self.receiver:
            if self.sender == self.thread.user.user:
                self.receiver = self.thread.psychologist.user
            elif self.sender == self.thread.psychologist.user:
                self.receiver = self.thread.user.user
        super().save(*args,**kwargs)

