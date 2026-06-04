# backend/core/urls.py
from django.contrib import admin
from django.urls import include, path

"""
Core URL configuration for the project. This file includes the admin interface and routes to API endpoints.
"""

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # includes all v1 endpoints
    path("api/v1/", include("api.v1.urls")),
]