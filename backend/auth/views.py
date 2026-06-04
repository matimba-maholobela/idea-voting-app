from .serializers import LoginSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
import logging

logger = logging.getLogger(__name__) 

@api_view(['POST'])
def login_view(request):
    """
    Handle user login and return JWT tokens.
    """
    
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():


            user = authenticate(request, username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            if user is None:
                logger.warning("failed login attempt  - invalid login credentials")

                return Response(
                    {'error': 'Invalid credentials.'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            #create access and refresh tokens for the authenticated user
            refresh_token = RefreshToken.for_user(user)
            access_token = str(refresh_token.access_token)

            logger.info(f"User logged in successfully: {user.id}")

            return Response({
                "message": "login successful", 
                "access_token": access_token, 
                "refresh_token": str(refresh_token)}, 
                status=status.HTTP_200_OK)
        
        else:
            logger.error("login validation failed - invalid input format")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Get new access token using refresh token.
    """
    refresh_token_str = request.data.get('refresh_token')
    
    if not refresh_token_str:
        logger.warning("Refresh token missing in request")
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Validate and get new access token
        refresh_token = RefreshToken(refresh_token_str)
        access_token = str(refresh_token.access_token)
        
        new_refresh_token = str(refresh_token)
        
        logger.info("Token refreshed successfully")
        return Response({
            'access_token': access_token,
            'refresh_token': new_refresh_token
        }, status=status.HTTP_200_OK)
        
    except TokenError as e:

        logger.exception(f"Token refresh failed: {str(e)}")

        return Response(
            {'error': 'Invalid or expired refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:

        logger.exception(f"Unexpected error during token refresh: {str(e)}")
        return Response(
            {'error': 'An error occurred while refreshing token'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user by blacklisting the refresh token.
    """
    refresh_token_str = request.data.get('refresh_token')
    
    if not refresh_token_str:
        logger.warning(f"Logout attempt without refresh token for user {request.user.id}")
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Blacklist the refresh token so it can't be used again
        refresh_token = RefreshToken(refresh_token_str)
        refresh_token.blacklist()
        
        logger.info(f"User logged out successfully: {request.user.username} (ID: {request.user.id})")
        return Response({
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK)
        
    except AttributeError:
    
        logger.warning("Token blacklist not enabled, token not blacklisted")
        return Response({
            'message': 'Logged out successfully (token not blacklisted)'
        }, status=status.HTTP_200_OK)
        
    except TokenError as e:
        logger.exception(f"Logout failed: {str(e)}")
        return Response(
            {'error': 'Invalid token'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"Unexpected error during logout: {str(e)}")
        return Response(
            {'error': 'An error occurred during logout'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Get current authenticated user's profile information.
    """
    user = request.user
    
    logger.info(f"Profile accessed for user ID: {user.id})")
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        'is_active': user.is_active,
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token_view(request):
    """
    Verify if an access token is valid.
    """
    access_token_str = request.data.get('access_token')
    
    if not access_token_str:
        return Response(
            {'error': 'Access token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Validate the token
        token = AccessToken(access_token_str)
        user_id = token.payload.get('user_id')
        
        return Response({
            'valid': True,
            'user_id': user_id
        }, status=status.HTTP_200_OK)
        
    except InvalidToken:
        return Response({
            'valid': False,
            'error': 'Invalid token'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.exception(f"Token verification failed: {str(e)}")
        return Response({
            'valid': False,
            'error': 'Token verification failed'
        }, status=status.HTTP_400_BAD_REQUEST)