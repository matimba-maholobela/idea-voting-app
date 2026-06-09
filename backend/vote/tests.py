from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from rest_framework.test import APIClient
from rest_framework import status
from idea.models import Idea
from vote.models import Vote

class TestSingleVotePerUser(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpass123'
        )
        self.idea = Idea.objects.create(
            title='Test Idea',
            description='Test Description',
            created_by=self.user
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_user_cannot_vote_twice(self):
        response1 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response1.data['vote_count'], 1)
        
        response2 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already voted', response2.data['error'].lower())
        
        vote_count = Vote.objects.filter(user=self.user, idea=self.idea).count()
        self.assertEqual(vote_count, 1)
        
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
    
    def test_database_unique_constraint(self):
        # First vote succeeds
        Vote.objects.create(user=self.user, idea=self.idea)
        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)
        
        # Second vote should raise IntegrityError
        with self.assertRaises(IntegrityError):
            with transaction.atomic():  
                Vote.objects.create(user=self.user, idea=self.idea)
        
        # Verify still only one vote
        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)
    
    def test_different_users_can_vote_on_same_idea(self):
        user2 = User.objects.create_user(username='user2', password='pass')
        user3 = User.objects.create_user(username='user3', password='pass')
        
        Vote.objects.create(user=self.user, idea=self.idea)
        Vote.objects.create(user=user2, idea=self.idea)
        Vote.objects.create(user=user3, idea=self.idea)
        
        self.idea.refresh_from_db()
        self.assertEqual(Vote.objects.filter(idea=self.idea).count(), 3)
        self.assertEqual(self.idea.vote_count, 3)
    
    def test_user_can_vote_on_multiple_ideas(self):
        idea2 = Idea.objects.create(title='Idea 2', description='Desc 2', created_by=self.user)
        idea3 = Idea.objects.create(title='Idea 3', description='Desc 3', created_by=self.user)
        
        Vote.objects.create(user=self.user, idea=self.idea)
        Vote.objects.create(user=self.user, idea=idea2)
        Vote.objects.create(user=self.user, idea=idea3)
        
        self.idea.refresh_from_db()
        idea2.refresh_from_db()
        idea3.refresh_from_db()
        
        self.assertEqual(Vote.objects.filter(user=self.user).count(), 3)
        self.assertEqual(self.idea.vote_count, 1)
        self.assertEqual(idea2.vote_count, 1)
        self.assertEqual(idea3.vote_count, 1)
    
    def test_remove_vote_then_vote_again(self):
        response1 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
        
        response2 = self.client.delete(f'/api/v1/votes/remove/{self.idea.id}/')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 0)
        
        response3 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
        
        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)