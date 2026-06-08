from django.db import models
from django.contrib.auth.models import User
from django.db.models import F
from idea.models import Idea

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='votes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'idea')
        indexes = [
            models.Index(fields=['user', 'idea']),
            models.Index(fields=['idea']),
            models.Index(fields=['created_at'])
        ]
    
    def save(self, *args, **kwargs):
        """Auto-update idea's vote_count when vote is created"""
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            # Use update to avoid recursion and double counting
            Idea.objects.filter(id=self.idea.id).update(vote_count=F('vote_count') + 1)
    
    def delete(self, *args, **kwargs):
        """Auto-update idea's vote_count when vote is deleted"""
        idea_id = self.idea.id
        super().delete(*args, **kwargs)
        Idea.objects.filter(id=idea_id).update(vote_count=F('vote_count') - 1)
    
    def __str__(self):
        return f"Vote by {self.user.username} for {self.idea.title}"