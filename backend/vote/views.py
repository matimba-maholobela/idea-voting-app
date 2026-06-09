from drf_yasg import openapi
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from vote.throttle import VoteRateThrottle
from .models import Vote
from .serializers import VoteSerializer, VoteStatsSerializer
from .services import VoteService
from idea.models import Idea

class VoteViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        if getattr(self, 'swagger_fake_view', False):
            return Vote.objects.none()
        return Vote.objects.filter(user=self.request.user).select_related('idea')
    
    @swagger_auto_schema(
        operation_summary="Cast a vote",
        operation_description="Allows an authenticated user to vote for an idea. One vote per user per idea.",
        responses={
            201: openapi.Response('Vote added', openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'message': openapi.Schema(type=openapi.TYPE_STRING),
                    'vote_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            )),
            400: "Already voted or idea not found"
        }
    )
    @action(detail=False, methods=['post'], url_path='cast/(?P<idea_id>[^/.]+)', throttle_classes=[VoteRateThrottle])
    def cast_vote(self, request, idea_id=None):
        """This method allows a user to cast a vote for an idea. It checks if the user has already voted for the idea and if not,
        it creates a new vote and increments the vote count of the idea."""

        success, message, vote_count = VoteService.cast_vote(request.user, idea_id)
        
        if success:
            return Response({'message': message, 'vote_count': vote_count}, status=status.HTTP_201_CREATED)
        return Response({'error': message, 'vote_count': vote_count}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'], url_path='remove/(?P<idea_id>[^/.]+)', throttle_classes=[VoteRateThrottle])
    def remove_vote(self, request, idea_id=None):
        """This method allows a user to remove their vote for an idea. It checks if the user has voted for the idea and if so,
        it deletes the vote and decrements the vote count of the idea."""

        success, message, vote_count = VoteService.remove_vote(request.user, idea_id)
        
        if success:
            return Response({'message': message, 'vote_count': vote_count}, status=status.HTTP_200_OK)
        return Response({'error': message, 'vote_count': vote_count}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='check/(?P<idea_id>[^/.]+)', throttle_classes=[VoteRateThrottle])
    def check_vote(self, request, idea_id=None):
        """This method checks if a user has already voted for a specific idea and returns the vote count of the idea."""

        has_voted = VoteService.has_user_voted(request.user, idea_id)
        
        try:
            idea = Idea.objects.get(id=idea_id)
            vote_count = idea.vote_count
        except Idea.DoesNotExist:
            vote_count = 0
        
        return Response({'has_voted': has_voted, 'vote_count': vote_count})
    
    @action(detail=False, methods=['get'], url_path='my-votes')
    def my_votes(self, request):
        """This method retrieves all the votes cast by the current user along with the related idea information."""

        votes = self.get_queryset()
        serializer = self.get_serializer(votes, many=True)
        return Response({'total': votes.count(), 'votes': serializer.data})
    
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """This method retrieves statistics about the votes, including total votes, unique voters, and the most voted idea."""
        stats = VoteService.get_vote_stats()
        serializer = VoteStatsSerializer(stats)
        return Response(serializer.data)