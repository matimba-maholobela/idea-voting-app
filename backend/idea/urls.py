from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IdeaViewSet


"""This is the URL configuration for the idea app. 
   It uses a DefaultRouter to automatically generate the URLs for the IdeaViewSet.
"""
router = DefaultRouter()
router.register('', IdeaViewSet, basename='idea')

urlpatterns = [
    path('', include(router.urls)),
]