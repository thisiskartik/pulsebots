import os
import json
import requests
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


def generate_verification_token(user):
    return default_token_generator.make_token(user)


def send_email(user, subject, html_message):
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to = user.email
    mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)


def send_verification_email(user):
    if user.is_email_verified:
        raise ValidationError("User already verified")

    token = generate_verification_token(user)
    html_message = render_to_string('email_verification.html', {
        'link': f"{os.environ.get('CLIENT_URI')}/auth/verify-email?token={token}&id={user.id}"
    })
    send_email(user, 'Email Verification', html_message)


def send_reset_password_email(user):
    token = generate_verification_token(user)
    html_message = render_to_string('reset_password.html', {
        'link': f"{os.environ.get('CLIENT_URI')}/auth/reset-password?token={token}&id={user.id}"
    })
    send_email(user, 'Reset Password', html_message)


def get_oauth_user_tokens(email, first_name, last_name, User):
    return_status = HTTP_200_OK
    try:
        user = User.objects.get(email=email)
    except (ObjectDoesNotExist, ValueError):
        user = User.objects.create_user(email=email, password=None, first_name=first_name, last_name=last_name)
        user.save()
        return_status = HTTP_201_CREATED

    return Response({
        "access": str(AccessToken.for_user(user)),
        "refresh": str(RefreshToken.for_user(user))
    }, return_status)


def get_oauth_sigin_response(openid_url, request, User, facebook=False, github=False):
    if 'access_token' not in request.data:
        return Response({'error': 'Missing Credentials'}, status=HTTP_400_BAD_REQUEST)

    headers = {'Authorization': f"Bearer {request.data['access_token']}"}
    request = requests.get(openid_url, headers=headers)
    data = json.loads(request.content)

    if not github or (github and data['email'] is not None):
        email = data['email']
    else:
        email_request = requests.get("https://api.github.com/user/emails", headers=headers)
        email_data = json.loads(email_request.content)
        email = email_data[0]['email']

    if facebook or github:
        first_name = data['name'].split(" ")[0]
        last_name = data['name'].split(" ")[1]
    else:
        first_name = data['given_name']
        last_name = data['family_name']

    return get_oauth_user_tokens(email, first_name, last_name, User)
