from rest_framework import serializers
from .models import Idea
from vote.models import Vote

class IdeaSerializer(serializers.ModelSerializer):
    is_voted_by_user = serializers.SerializerMethodField()
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    
    class Meta:
        model = Idea
        fields = ['id', 'title', 'description', 'vote_count', 
                  'created_by_username', 'created_at', 
                  'is_voted_by_user', 'can_edit', 'can_delete']
        
        read_only_fields = ['vote_count', 'created_at', 'created_by_username']
    
    def _is_owner(self, obj):
        """Helper method to check if current user is the owner of the idea"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.created_by == request.user
        return False
    
    def get_is_voted_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Vote.objects.filter(user=request.user, idea=obj).exists()
        return False
    
    def get_can_edit(self, obj):
        """Check if current user can edit this idea (only the owner can edit)"""
        return self._is_owner(obj)
    
    def get_can_delete(self, obj):
        """Check if current user can delete this idea (only the owner can delete)"""
        return self._is_owner(obj)
    
    def create(self, validated_data):
        """Create a new idea and set the created_by field to the current user"""
        
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)