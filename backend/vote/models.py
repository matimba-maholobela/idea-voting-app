from django.db import models
from django.contrib.auth.models import User
from idea.models import Idea

class Vote(models.Model):
    user = models.ForeignKey(

        User, on_delete=models.CASCADE, related_name='votes')
    
    idea = models.ForeignKey( Idea, on_delete=models.CASCADE,related_name='votes')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        
        unique_together = ('user', 'idea') 
        indexes = [
            models.Index(fields=['user', 'idea']),
            models.Index(fields=['idea']), 
            models.Index(fields=['created_at'])
        ]
        
    def __str__(self):        
        return f"Vote by {self.user.username} for {self.idea.title}"