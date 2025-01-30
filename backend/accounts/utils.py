import random
from django.core.mail import send_mail

def generate_otp():
    return random.randint(100000,999999)

def send_otp_email(email, otp):
    subject = "Email Verification OTP"
    message = f"Hii There. \n \n Your OTP for email verification is: {otp}\n \n Best regards,\n MindHeal "
    from_email = "bithulmb07@gmail.com"
    recipient_list = [email]
    print("inside email")
    send_mail(subject, message, from_email, recipient_list,fail_silently=False)
    print("email sent")
