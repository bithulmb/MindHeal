from django.urls import path
from .views import CreateChannelView,GenerateTokenView

urlpatterns = [
    path('create-channel/', CreateChannelView.as_view()),
    path('generate-token/', GenerateTokenView.as_view()),
]