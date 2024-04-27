import os
import json
import requests
from requests_oauthlib import OAuth1
from urllib.parse import parse_qs
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_201_CREATED, HTTP_200_OK
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.utils import aware_utcnow
from email_validator import validate_email, EmailNotValidError
from pkce import generate_pkce_pair
from .models import User, PKCECodeVerifier
from .serializers import UserSerializer
from .managers import UserManager
from .utils import send_verification_email, send_reset_password_email, get_oauth_sigin_response, get_oauth_user_tokens


@api_view(['POST'])
def register(request):
    if 'email' not in request.data or \
            'password' not in request.data or \
            'first_name' not in request.data or \
            'last_name' not in request.data:
        return Response({'error': 'Missing credentials'}, status=HTTP_400_BAD_REQUEST)

    try:
        validate_email(request.data['email'])
    except EmailNotValidError:
        return Response({'error': 'Invalid email address'}, status=HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=request.data['email']).exists():
        return Response({'error': f"An account already exists with {request.data['email']} email address. Please login."},
                        status=HTTP_403_FORBIDDEN)

    try:
        validate_password(request.data['password'])
    except ValidationError as e:
        return Response({'error': e}, status=HTTP_400_BAD_REQUEST)

    try:
        new_user = User.objects.create_user(email=request.data['email'],
                                            password=request.data['password'],
                                            first_name=request.data['first_name'],
                                            last_name=request.data['last_name'])
    except ValueError as e:
        return Response({'error': "Oops! something went wrong"}, status=HTTP_400_BAD_REQUEST)

    return Response(UserSerializer(new_user, many=False).data, status=HTTP_201_CREATED)


@api_view(['POST'])
def generate_pkce_challenge(request):
    if 'session_id' not in request.data:
        return Response({'error': 'Missing session id'}, status=HTTP_400_BAD_REQUEST)

    return_status = HTTP_200_OK
    try:
        pkce_code = PKCECodeVerifier.objects.get(session=request.data['session_id'])
        code_challenge = pkce_code.code_challenge
    except (ObjectDoesNotExist, ValueError):
        code_verifier, code_challenge = generate_pkce_pair()
        pkce_code = PKCECodeVerifier.objects.create(session=request.data['session_id'],
                                                    code_challenge=code_challenge,
                                                    code_verifier=code_verifier)
        pkce_code.save()
        return_status = HTTP_201_CREATED

    return Response({'code_challenge': code_challenge}, return_status)


@api_view(['POST'])
def get_pkce_verifier(request):
    if 'session_id' not in request.data:
        return Response({'error': 'Missing session id'}, status=HTTP_400_BAD_REQUEST)

    try:
        pkce_code = PKCECodeVerifier.objects.get(session=request.data['session_id'])
    except (ObjectDoesNotExist, ValueError):
        return Response({'error': 'Invalid session id'}, status=HTTP_400_BAD_REQUEST)

    return Response({"code_verifier": pkce_code.code_verifier}, HTTP_200_OK)


@api_view(['POST'])
def google(request):
    return get_oauth_sigin_response("https://www.googleapis.com/oauth2/v2/userinfo", request, User)


@api_view(['POST'])
def linkedin(request):
    return get_oauth_sigin_response("https://api.linkedin.com/v2/userinfo", request, User)


@api_view(['POST'])
def facebook(request):
    return get_oauth_sigin_response("https://graph.facebook.com/me?fields=email,name", request, User, facebook=True)


@api_view(['POST'])
def github(request):
    return get_oauth_sigin_response("https://api.github.com/user", request, User, github=True)


@api_view(['POST'])
def twitter(request):
    if 'oauth_token' not in request.data or \
            'oauth_token_secret' not in request.data:
        return Response({'error': 'Missing tokens'}, status=HTTP_400_BAD_REQUEST)

    oauth = OAuth1(client_key=os.environ.get("TWITTER_CONSUMER_API_KEY"),
                   client_secret=os.environ.get("TWITTER_CONSUMER_API_KEY_SECRET"),
                   resource_owner_key=request.data['oauth_token'],
                   resource_owner_secret=request.data['oauth_token_secret'])
    request = requests.get(url="https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
                           auth=oauth)
    data = json.loads(request.content)

    email = data['email']
    first_name = data['name'].split(" ")[0]
    last_name = data['name'].split(" ")[1]
    print(email, first_name, last_name)

    return get_oauth_user_tokens(email, first_name, last_name, User)


@api_view(['POST'])
def generate_twitter_oauth_tokens(request):
    if 'session_id' not in request.data:
        return Response({'error': 'Missing session id'}, status=HTTP_400_BAD_REQUEST)

    try:
        pkce_code = PKCECodeVerifier.objects.get(session=request.data['session_id'])
    except (ObjectDoesNotExist, ValueError):
        code_verifier, code_challenge = generate_pkce_pair()
        pkce_code = PKCECodeVerifier.objects.create(session=request.data['session_id'],
                                                    code_challenge=code_challenge,
                                                    code_verifier=code_verifier)

    oauth = OAuth1(client_key=os.environ.get("TWITTER_CONSUMER_API_KEY"),
                   client_secret=os.environ.get("TWITTER_CONSUMER_API_KEY_SECRET"),
                   resource_owner_key=os.environ.get("TWITTER_ACCESS_TOKEN"),
                   resource_owner_secret=os.environ.get("TWITTER_ACCESS_TOKEN_SECRET"))
    request = requests.get(url="https://api.twitter.com/oauth/request_token",
                           auth=oauth)
    data = parse_qs(request.content)

    pkce_code.twitter_oauth_token = data[b'oauth_token'][0].decode()
    pkce_code.twitter_oauth_token_secret = data[b'oauth_token_secret'][0].decode()
    pkce_code.save()

    return Response({"oauth_token": pkce_code.twitter_oauth_token}, HTTP_200_OK)


@api_view(['POST'])
def get_twitter_oauth_token(request):
    if 'session_id' not in request.data:
        return Response({'error': 'Missing tokens'}, status=HTTP_400_BAD_REQUEST)

    try:
        pkce_code = PKCECodeVerifier.objects.get(session=request.data['session_id'])
    except (ObjectDoesNotExist, ValueError):
        return Response({'error': 'Invalid session id'}, status=HTTP_403_FORBIDDEN)

    return Response({'oauth_token': pkce_code.twitter_oauth_token}, HTTP_200_OK)


@api_view(['POST'])
def verify_email(request):
    if 'token' in request.data and 'id' in request.data:
        try:
            user = User.objects.get(pk=request.data['id'])
        except (ObjectDoesNotExist, ValueError):
            return Response({'error': 'Invalid ID'}, status=HTTP_403_FORBIDDEN)

        if default_token_generator.check_token(user, request.data['token']):
            user.is_email_verified = True
            user.save()
            return Response({'success': 'Verified'}, status=HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Token'}, status=HTTP_403_FORBIDDEN)
    elif request.user.is_authenticated:
        try:
            send_verification_email(request.user)
            return Response({'success': 'Verification email sent'}, status=HTTP_200_OK)
        except ValidationError:
            return Response({'error': 'User already verified'}, status=HTTP_403_FORBIDDEN)
    else:
        return Response({'error': 'Missing Parameters'}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def reset_password(request):
    if 'email' in request.data:
        try:
            user = User.objects.get(email=request.data['email'])
        except ObjectDoesNotExist:
            return Response({'error': f'No user registered with {request.data["email"]}'}, status=HTTP_403_FORBIDDEN)

        send_reset_password_email(user)
        return Response({'success': 'Password reset link sent'}, status=HTTP_200_OK)
    elif 'token' in request.data and 'id' in request.data and 'password' in request.data:
        try:
            user = User.objects.get(pk=request.data['id'])
        except (ObjectDoesNotExist, ValueError):
            return Response({'error': 'Invalid ID'}, status=HTTP_403_FORBIDDEN)

        try:
            validate_password(request.data['password'])
        except ValidationError as e:
            return Response({'error': e}, status=HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, request.data['token']):
            user.set_password(request.data['password'])
            user.save()
            for token in OutstandingToken.objects.filter(expires_at__gt=aware_utcnow()).filter(user=user):
                if not BlacklistedToken.objects.filter(token=token).exists():
                    RefreshToken(token.token).blacklist()
            return Response({'success': 'Password reset successfully'}, status=HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Token'}, status=HTTP_403_FORBIDDEN)
    else:
        return Response({'error': 'Missing Parameters'}, status=HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def user(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user, many=False).data, HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'PATCH':
        if 'first_name' in request.data:
            request.user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            request.user.last_name = request.data['last_name']
        if 'email' in request.data:
            try:
                validate_email(request.data['email'])
            except EmailNotValidError:
                return Response({'error': 'Invalid email address'}, status=HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=request.data['email']).exists():
                return Response({'error': f"An account already exists with {request.data['email']} email address."},
                                status=HTTP_403_FORBIDDEN)

            request.user.email = UserManager.normalize_email(request.data['email'])
            request.user.is_email_verified = False

        request.user.save()
        return Response(UserSerializer(request.user, many=False).data, status=HTTP_200_OK)
    elif request.method == 'DELETE':
        request.user.delete()
        return Response({'success': 'User deleted successfully'}, status=HTTP_200_OK)
