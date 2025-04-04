import random
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.tasks import send_async_email

def generate_otp():
    return random.randint(100000,999999)

def send_otp_email(email, otp):
    subject = "Email Verification OTP"
    message = f"Hii There. \n \n Your OTP for email verification is: {otp}\n \n Best regards,\n MindHeal "
    from_email = "bithulmb07@gmail.com"
    recipient_list = [email]
    send_async_email.delay(subject, message, from_email, recipient_list)
    
   
def send_reset_password_mail(email,reset_link):
    subject = "Password Reset Request"
    message =  f"Click the link to reset your password: \n {reset_link}"
    from_email =  "bithulmb07@gmail.com"
    recipient_list = [email]
    send_async_email.delay(subject, message, from_email, recipient_list)


class CustomRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user):
        # Call the parent method to get the token
        token = super().for_user(user)

       
        token['email'] = user.email
        token['name'] = user.first_name + " " + user.last_name
        token['role'] = user.role  
        token['is_email_verified'] = user.is_email_verified
        token['is_blocked'] = user.is_blocked

        return token