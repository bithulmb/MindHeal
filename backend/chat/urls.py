from django.urls import path
from .views import ChatThreadView, ChatMessageView

urlpatterns = [
    path("thread/<int:psychologist_id>/", ChatThreadView.as_view(), name="chat-thread"),
    path("messages/<int:thread_id>/", ChatMessageView.as_view(), name="chat-messages"),
]
