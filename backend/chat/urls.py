from django.urls import path
from .views import ChatThreadView, ChatMessageView,GetChatThreadsListView

urlpatterns = [
    # path("thread/<int:psychologist_id>/", ChatThreadView.as_view(), name="chat-thread"),
    path("messages/<int:thread_id>/", ChatMessageView.as_view(), name="chat-messages"),
    path('threads/',GetChatThreadsListView.as_view(), name='chat-threads-list'),
    path('thread/',ChatThreadView.as_view(), name="chat-thread"),
]
