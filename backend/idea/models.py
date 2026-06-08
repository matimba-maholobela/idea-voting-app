# backend/idea/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
from django.utils import timezone

class Idea(models.Model):
    title = models.CharField( max_length=255, validators=[MinLengthValidator(2)],unique=True )

    description = models.TextField()

    vote_count = models.IntegerField( default=0,db_index=True)

    created_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name='ideas_created')

    created_at = models.DateTimeField(auto_now_add=True,db_index=True )
    
    class Meta:
        ordering = ['-vote_count', '-created_at'] 
        indexes = [
            models.Index(fields=['-vote_count', '-created_at']),
            models.Index(fields=['created_by']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.vote_count} votes"