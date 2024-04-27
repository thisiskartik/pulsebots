from django.contrib.auth.base_user import BaseUserManager
from .utils import send_verification_email


class UserManager(BaseUserManager):

    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        if not extra_fields.get('first_name'):
            raise ValueError('First Name must be set')
        if not extra_fields.get('last_name'):
            raise ValueError('Last Name must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save()

        if password:
            send_verification_email(user)
        else:
            user.is_email_verified = True
            user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)
