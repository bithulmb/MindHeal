from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import ChatThread, ChatMessage
import json

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.thread_id = self.scope['url_route']['kwargs']['thread_id']
        self.room_group_name = f"chat_{self.thread_id}"

        # Check if the user is authenticated
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close() 
            return

        # Fetch the thread and related fields asynchronously
        thread = await self.get_thread(self.thread_id)
        if not thread:
            await self.close() 
            return

        # Fetch related user objects asynchronously
        thread_user = await self.get_thread_user(thread)
        thread_psychologist = await self.get_thread_psychologist(thread)

        # Authorization check
        if user != thread_user and user != thread_psychologist:
            await self.close()  # Forbidden
            return

        # Add user to the channel group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        sender = self.scope["user"]

        thread = await self.get_thread(self.thread_id)
        if not thread:
            return

        # Fetch related user objects asynchronously
        thread_user = await self.get_thread_user(thread)
        thread_psychologist = await self.get_thread_psychologist(thread)

        if sender != thread_user and sender != thread_psychologist:
            return

        chat_message = await self.create_message(thread, sender, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender.id,
                "timestamp": str(chat_message.timestamp),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "timestamp": event["timestamp"],
        }))

    @database_sync_to_async
    def get_thread(self, thread_id):
        try:
            # Use select_related to fetch related objects in one query
            return ChatThread.objects.select_related('user__user', 'psychologist__user').get(id=thread_id)
        except ChatThread.DoesNotExist:
            return None

    @database_sync_to_async
    def get_thread_user(self, thread):
        return thread.user.user if thread.user else None

    @database_sync_to_async
    def get_thread_psychologist(self, thread):
        return thread.psychologist.user if thread.psychologist else None

    @database_sync_to_async
    def create_message(self, thread, sender, message):
        return ChatMessage.objects.create(thread=thread, sender=sender, message=message)