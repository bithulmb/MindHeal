from django.urls import path
from .views import PaymentListCreateView,PaymentDetailView,RazorpayCreateOrderAPIView,WalletDetailsView

urlpatterns = [
    
    path('razorpay/create-order/',RazorpayCreateOrderAPIView.as_view(), name='razorpay-create-order'),
    
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
    
    path('wallet/details/',WalletDetailsView.as_view(),name='wallet-details'),
]