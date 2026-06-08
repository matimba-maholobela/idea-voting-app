from django.contrib import admin
from django.urls import include, path

"""
This is the main URL configuration for the API. It includes the URLs for the auth,idea and vote apps.
"""

urlpatterns = [
    
    #endpoinnts for auth
    path('auth/', include('auth.urls')),

    #endpoints for ideas
    path('ideas/', include('idea.urls')),

    #endpoints for votes
    path('votes/', include('vote.urls')),
]