from auth.views import login_view, refresh_token_view, logout_view, profile_view, verify_token_view
from django.urls import path
"""
This is the URL configuration for the auth app.
"""
app_name = 'auth'

urlpatterns = [
    path("login/", login_view, name="login"),
    path("refresh/", refresh_token_view, name="token_refresh"),
    path("logout/", logout_view, name="logout"),
    path("profile/", profile_view, name="profile"),
    path("verify-token/", verify_token_view, name="verify_token"),
]