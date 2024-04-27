from uuid import uuid4
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager


class PKCECodeVerifier(models.Model):
    session = models.CharField(max_length=200, unique=True)
    code_challenge = models.CharField(max_length=200)
    code_verifier = models.CharField(max_length=200)

    twitter_oauth_token = models.CharField(max_length=200)
    twitter_oauth_token_secret = models.CharField(max_length=200)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} | {self.email}"
