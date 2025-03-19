from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatThread, ChatMessage
from django.contrib.auth import get_user_model
import json
from asgiref.sync import sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """ User connects to websocket """
        self.thread_id = self.scope["url_route"]["kwargs"]["thread_id"]
        self.room_group_name = f"chat_{self.thread_id}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
    async def disconnect(self, close_code):
        """User disconnects from the websocket"""
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    
    async def receive(self, text_data):
        """handle incoming messages"""
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender']

        sender = await sync_to_async(User.objects.get)(id=sender_id)
        thread = await sync_to_async(ChatThread.objects.get)(id = self.thread_id)

        chat_message = await sync_to_async(ChatMessage.objects.create)(thread=thread, sender= sender, message=message)

        # Broadcast message to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender.first_name,
                "timestamp": str(chat_message.timestamp),
            },
        )


    async def chat_message(self, event):
        """send message to websocket"""
        await self.send(text_data=json.dumps(event))
    