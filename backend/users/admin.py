from django.contrib import admin
from .models import User, PKCECodeVerifier

admin.site.register(User)
admin.site.register(PKCECodeVerifier)
