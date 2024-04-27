from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import register, user, verify_email, reset_password, \
    generate_pkce_challenge, get_pkce_verifier, google, linkedin, facebook, github, \
    twitter, generate_twitter_oauth_tokens, get_twitter_oauth_token


urlpatterns = [
    path('', user),
    path('register/', register),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('token/revoke/', TokenBlacklistView.as_view()),
    path('verify_email/', verify_email),
    path('reset_password/', reset_password),
    path('oauth/generate_pkce_challenge/', generate_pkce_challenge),
    path('oauth/get_pkce_verifier/', get_pkce_verifier),
    path("oauth/google/", google),
    path("oauth/linkedin/", linkedin),
    path("oauth/facebook/", facebook),
    path("oauth/github/", github),
    path("oauth/twitter/", twitter),
    path("oauth/twitter/generate_twitter_oauth_tokens/", generate_twitter_oauth_tokens),
    path("oauth/twitter/get_twitter_oauth_token/", get_twitter_oauth_token),
]
