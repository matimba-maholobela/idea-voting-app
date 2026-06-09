from .serializers import LoginSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging
from drf_yasg.utils import swagger_auto_schema

logger = logging.getLogger(__name__)

try:
    from .docs import (
        AUTH_TAG,
        login_request,
        token_refresh_request,
        logout_request,
        verify_token_request,
        LOGIN_RESPONSES,
        TOKEN_REFRESH_RESPONSES,
        LOGOUT_RESPONSES,
        PROFILE_RESPONSES,
        VERIFY_TOKEN_RESPONSES,
    )
except ImportError as e:
    print(f"Import error: {e}")
    AUTH_TAG = 'Authentication'
    login_request = None
    token_refresh_request = None
    logout_request = None
    verify_token_request = None
    LOGIN_RESPONSES = {}
    TOKEN_REFRESH_RESPONSES = {}
    LOGOUT_RESPONSES = {}
    PROFILE_RESPONSES = {}
    VERIFY_TOKEN_RESPONSES = {}


@swagger_auto_schema(
    method='post',
    request_body=login_request,
    responses=LOGIN_RESPONSES,
    operation_summary="User login",
    operation_description="Authenticate user and return JWT tokens",
    tags=[AUTH_TAG]
)
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        logger.error("Login validation failed - invalid input format")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        request,
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password']
    )
    if user is None:
        logger.warning("Failed login attempt - invalid login credentials")
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    logger.info(f"User logged in successfully: {user.id}")

    return Response({
        "message": "login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    method='post',
    request_body=token_refresh_request,
    responses=TOKEN_REFRESH_RESPONSES,
    operation_summary="Refresh access token",
    operation_description="Use a valid refresh token to obtain a new access token",
    tags=[AUTH_TAG]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    refresh_token_str = request.data.get('refresh_token')
    if not refresh_token_str:
        logger.warning("Refresh token missing in request")
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
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


@swagger_auto_schema(
    method='post',
    request_body=logout_request,
    responses=LOGOUT_RESPONSES,
    operation_summary="Logout user",
    operation_description="Blacklist the refresh token and log out the user",
    tags=[AUTH_TAG]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token_str = request.data.get('refresh_token')
    if not refresh_token_str:
        logger.warning(f"Logout attempt without refresh token for user {request.user.id}")
        return Response(
            {'error': 'Refresh token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh_token = RefreshToken(refresh_token_str)
        refresh_token.blacklist()
        logger.info(f"User logged out successfully: {request.user.username} (ID: {request.user.id})")
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except AttributeError:
        logger.warning("Token blacklist not enabled, token not blacklisted")
        return Response({'message': 'Logged out successfully (token not blacklisted)'}, status=status.HTTP_200_OK)
    except TokenError as e:
        logger.exception(f"Logout failed: {str(e)}")
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.exception(f"Unexpected error during logout: {str(e)}")
        return Response({'error': 'An error occurred during logout'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(
    method='get',
    responses=PROFILE_RESPONSES,
    operation_summary="Get user profile",
    operation_description="Return the current authenticated user's profile information",
    tags=[AUTH_TAG]
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    logger.info(f"Profile accessed for user ID: {user.id}")
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


@swagger_auto_schema(
    method='post',
    request_body=verify_token_request,
    responses=VERIFY_TOKEN_RESPONSES,
    operation_summary="Verify access token",
    operation_description="Check if an access token is valid",
    tags=[AUTH_TAG]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_token_view(request):
    access_token_str = request.data.get('access_token')
    if not access_token_str:
        return Response(
            {'error': 'Access token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        token = AccessToken(access_token_str)
        user_id = token.payload.get('user_id')
        return Response({'valid': True, 'user_id': user_id}, status=status.HTTP_200_OK)
    except InvalidToken:
        return Response({'valid': False, 'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.exception(f"Token verification failed: {str(e)}")
        return Response({'valid': False, 'error': 'Token verification failed'}, status=status.HTTP_400_BAD_REQUEST)