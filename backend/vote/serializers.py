from rest_framework import serializers
from .models import Vote

class VoteSerializer(serializers.ModelSerializer):
    idea_title = serializers.ReadOnlyField(source='idea.title')
    username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Vote
        fields = ['id', 'user', 'username', 'idea', 'idea_title', 'created_at']
        read_only_fields = ['created_at', 'user', 'username']

class VoteStatsSerializer(serializers.Serializer):
    total_votes = serializers.IntegerField()
    unique_voters = serializers.IntegerField()
    most_voted_idea = serializers.CharField()
    most_voted_count = serializers.IntegerField()