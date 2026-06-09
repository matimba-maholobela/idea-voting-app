# Solution Design & Trade-offs

---

## 1. Architecture Overview

The application is split into two independent parts:

- **Backend**: Django REST Framework with a modular app structure (`auth`, `idea`, `vote`)
- **Frontend**: React SPA with custom hooks, Context API, and Tailwind CSS

Communication uses JWT tokens (stored in `localStorage`) over a RESTful API.

---

## 2. Database Design

- **Idea model**: stores title, description, and denormalized `vote_count` for fast sorting
- **Vote model**: connects a user to an idea with a `unique_together` constraint to enforce the single-vote rule

```python
class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'idea')

Why denormalize vote_count?

Sorting by vote count would otherwise require COUNT(*) queries, which become slow as data grows.
The denormalized field is updated atomically using F() expressions.

3. Authentication & Security
JWT with rest_framework_simplejwt
Tokens stored in localStorage (simple for learning purposes; production should use HttpOnly cookies)
Refresh token rotation and blacklisting enabled
Rate limiting (60 votes/minute) protects voting endpoints from abuse
Trade-off

localStorage is vulnerable to XSS, but acceptable for a learning project.
In production, HttpOnly + SameSite cookies should be used.

4. Voting Logic – Single-Vote Enforcement

The rule is enforced at three levels:

Database → unique_together prevents duplicates
Service layer → checks existence before creating a vote
API layer → returns a 400 Bad Request with a clear error message
Atomic vote update
Idea.objects.filter(id=idea_id).update(
    vote_count=F('vote_count') + 1
)

This prevents race conditions under concurrent requests.

5. Frontend Architecture
Context API (AuthContext) manages authentication globally
Custom hooks (useAuth, useIdeas) encapsulate logic and API calls
Optimistic voting updates UI immediately, then syncs with backend; reverts on error with toast notification
Tailwind CSS ensures responsive, minimal styling
6. API Documentation
Auto-generated OpenAPI docs via drf-yasg
Swagger UI: /swagger/
ReDoc: /redoc/

All endpoints include request/response schemas and authentication metadata.

7. Testing Strategy

A dedicated test ensures single-vote enforcement:

def test_user_cannot_vote_twice(self):
    response1 = self.client.post(f'/votes/cast/{self.idea.id}/')
    assert response1.status_code == 201

    response2 = self.client.post(f'/votes/cast/{self.idea.id}/')
    assert response2.status_code == 400
    assert 'already voted' in response2.data['error'].lower()
Covered test cases:
Database-level uniqueness constraint
Multiple users voting on same idea
Voting on different ideas
Removing and re-voting

8. Trade-offs & Future Improvements
Decision	Rationale	Improvement
SQLite	Zero config, great for dev	Switch to PostgreSQL
localStorage tokens	Simple implementation	Use HttpOnly cookies
No pagination (stats)	Small dataset	Add pagination later
No WebSockets	Reduced complexity	Add Django Channels