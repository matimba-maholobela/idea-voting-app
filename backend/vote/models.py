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
        is_new = self.pk is None
        if is_new:
            Idea.objects.filter(id=self.idea.id).update(vote_count=F('vote_count') + 1)
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        idea_id = self.idea.id
        Idea.objects.filter(id=idea_id, vote_count__gt=0).update(vote_count=F('vote_count') - 1)
        super().delete(*args, **kwargs)
    
    def __str__(self):
        return f"Vote by {self.user.username} for {self.idea.title}"