from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Idea
from .serializers import IdeaSerializer
from .permissions import IsOwnerOrReadOnly

class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        """this function is used to sort the ideas based on query parameter 'sort_by' which can be 'votes' or 'recent'.
        By default, it sorts by votes.
        """
        queryset = Idea.objects.select_related('created_by')
        sort_by = self.request.query_params.get('sort_by', 'votes')
        
        if sort_by == 'votes':
            return queryset.order_by('-vote_count', '-created_at')
        elif sort_by == 'recent':
            return queryset.order_by('-created_at')
        return queryset
    
    def perform_create(self, serializer):
        """
        this function is used to set the created_by field of the idea to the current user when creating a new idea.
        """
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_ideas(self, request):
        """this function is used to get the ideas created by the current user with pagination."""

        ideas = Idea.objects.filter(created_by=request.user)
        page = self.paginate_queryset(ideas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(ideas, many=True)
        return Response(serializer.data)