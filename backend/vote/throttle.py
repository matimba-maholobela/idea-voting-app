from rest_framework.throttling import UserRateThrottle

class VoteRateThrottle(UserRateThrottle):
    """Custom throttle class for voting to prevent abuse
    """
    rate = '60/minute'
    scope = 'vote'