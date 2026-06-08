from django.test import TestCase
from django.contrib.auth.models import User
from django.db import IntegrityError
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
        """First vote succeeds, second vote fails"""
        # First vote - should succeed
        response1 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response1.data['vote_count'], 1)
        
        # Second vote - should fail
        response2 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already voted', response2.data['error'].lower())
        
        # Verify only one vote exists
        vote_count = Vote.objects.filter(user=self.user, idea=self.idea).count()
        self.assertEqual(vote_count, 1)
        
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
    
    def test_database_unique_constraint(self):
        """Database level constraint prevents duplicate votes"""
        # This test should use a try/except to catch IntegrityError
        Vote.objects.create(user=self.user, idea=self.idea)
        
        # Second vote should raise IntegrityError
        with self.assertRaises(IntegrityError):
            Vote.objects.create(user=self.user, idea=self.idea)
        
        # Verify only one vote exists
        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)
    
    def test_different_users_can_vote_on_same_idea(self):
        """Multiple users can vote on the same idea"""
        user2 = User.objects.create_user(username='user2', password='pass')
        user3 = User.objects.create_user(username='user3', password='pass')
        
        # Use the model create method (this will trigger save())
        Vote.objects.create(user=self.user, idea=self.idea)
        Vote.objects.create(user=user2, idea=self.idea)
        Vote.objects.create(user=user3, idea=self.idea)
        
        # Refresh idea from database
        self.idea.refresh_from_db()
        
        self.assertEqual(Vote.objects.filter(idea=self.idea).count(), 3)
        self.assertEqual(self.idea.vote_count, 3)
    
    def test_user_can_vote_on_multiple_ideas(self):
        """User can vote on different ideas"""
        idea2 = Idea.objects.create(title='Idea 2', description='Desc 2', created_by=self.user)
        idea3 = Idea.objects.create(title='Idea 3', description='Desc 3', created_by=self.user)
        
        # Use the model create method
        Vote.objects.create(user=self.user, idea=self.idea)
        Vote.objects.create(user=self.user, idea=idea2)
        Vote.objects.create(user=self.user, idea=idea3)
        
        # Refresh all ideas
        self.idea.refresh_from_db()
        idea2.refresh_from_db()
        idea3.refresh_from_db()
        
        self.assertEqual(Vote.objects.filter(user=self.user).count(), 3)
        self.assertEqual(self.idea.vote_count, 1)
        self.assertEqual(idea2.vote_count, 1)
        self.assertEqual(idea3.vote_count, 1)
    
    def test_remove_vote_then_vote_again(self):
        """After removing a vote, user can vote again"""
        # Vote
        response1 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
        
        # Remove vote
        response2 = self.client.delete(f'/api/v1/votes/remove/{self.idea.id}/')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 0)
        
        # Vote again
        response3 = self.client.post(f'/api/v1/votes/cast/{self.idea.id}/')
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)
        
        self.idea.refresh_from_db()
        self.assertEqual(self.idea.vote_count, 1)
        
        self.assertEqual(Vote.objects.filter(user=self.user, idea=self.idea).count(), 1)