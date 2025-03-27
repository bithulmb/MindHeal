from django.urls import path
from .views import CreateChannelView,GenerateZegoTokenView

urlpatterns = [
    path('create-channel/', CreateChannelView.as_view(),name='create_channel'),
    path('generate-zego-token/', GenerateZegoTokenView.as_view(), name='generate_zego_token'),

]