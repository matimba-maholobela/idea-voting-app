from django.db import IntegrityError
from django.db.models import F
from .models import Vote
from idea.models import Idea

class VoteService:
    
    @staticmethod
    def cast_vote(user, idea_id):
        """
        This method allows a user to cast a vote for an idea. It checks if the user has already voted for the idea and if not,
        it creates a new vote and increments the vote count of the idea."""
        try:
            idea = Idea.objects.get(id=idea_id)
        except Idea.DoesNotExist:
            return False, "Idea not found", 0
        
        if Vote.objects.filter(user=user, idea=idea).exists():
            return False, "You have already voted for this idea", idea.vote_count
        
        try:
            Vote.objects.create(user=user, idea=idea)
            Idea.objects.filter(id=idea.id).update(vote_count=F('vote_count') + 1)
            idea.refresh_from_db()
            return True, "Vote added successfully", idea.vote_count
        except IntegrityError:
            return False, "You have already voted for this idea", idea.vote_count
    
    @staticmethod
    def remove_vote(user, idea_id):
        """This method allows a user to remove their vote for an idea. It checks if the user has voted for the idea and if so,
        it deletes the vote and decrements the vote count of the idea."""

        try:
            idea = Idea.objects.get(id=idea_id)
        except Idea.DoesNotExist:
            return False, "Idea not found", 0
        
        try:
            vote = Vote.objects.get(user=user, idea=idea)
            vote.delete()
            Idea.objects.filter(id=idea.id).update(vote_count=F('vote_count') - 1)
            idea.refresh_from_db()
            return True, "Vote removed successfully", idea.vote_count
        except Vote.DoesNotExist:
            return False, "You have not voted for this idea", idea.vote_count
    
    @staticmethod
    def has_user_voted(user, idea_id):
        """This method checks if a user has already voted for a specific idea."""

        return Vote.objects.filter(user=user, idea_id=idea_id).exists()
    
    @staticmethod
    def get_user_votes(user):
        """This method retrieves all the votes cast by a specific user along with the related idea information."""

        return Vote.objects.filter(user=user).select_related('idea')
    
    @staticmethod
    def get_vote_stats():
        """This method retrieves statistics about the votes, including total votes, unique voters, and the most voted idea."""
        
        total_votes = Vote.objects.count()
        unique_voters = Vote.objects.values('user').distinct().count()
        most_voted = Idea.objects.order_by('-vote_count').first()
        
        return {
            'total_votes': total_votes,
            'unique_voters': unique_voters,
            'most_voted_idea': most_voted.title if most_voted else None,
            'most_voted_count': most_voted.vote_count if most_voted else 0
        }