from django.contrib import admin
from django.urls import include, path

"""
This is the main URL configuration for the API. It includes the URLs for the auth,idea and vote apps.
"""

urlpatterns = [
    
    path('auth/', include('auth.urls')),

    #the below not yet implemented
    #path('idea/', include('idea.urls')),
    # path('vote/', include('vote.urls')),
]