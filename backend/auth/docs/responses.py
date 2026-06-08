# authentication/docs/responses.py
from drf_yasg import openapi
from .swagger import (
    login_response_schema,
    profile_response_schema,
    token_refresh_response_schema,
    verify_token_response_schema,
)

# ========== Common HTTP Responses (reusable across all endpoints) ==========

class AuthResponses:
    """Authentication-specific HTTP responses"""
    
    # Success Responses
    LOGIN_SUCCESS = openapi.Response(
        description="Login successful - Returns JWT tokens",
        schema=login_response_schema
    )
    
    PROFILE_SUCCESS = openapi.Response(
        description="Profile retrieved successfully",
        schema=profile_response_schema
    )
    
    TOKEN_REFRESH_SUCCESS = openapi.Response(
        description="Token refreshed successfully",
        schema=token_refresh_response_schema
    )
    
    TOKEN_VERIFY_SUCCESS = openapi.Response(
        description="Token is valid",
        schema=verify_token_response_schema
    )
    
    LOGOUT_SUCCESS = openapi.Response(
        description="Logout successful",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    example='Successfully logged out'
                )
            }
        )
    )
    
    # Error Responses
    BAD_REQUEST = openapi.Response(
        description="Bad Request - Invalid input data",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, example='Invalid input'),
                'details': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description='Validation error details'
                )
            }
        )
    )
    
    UNAUTHORIZED = openapi.Response(
        description="Unauthorized - Invalid credentials or token",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, example='Invalid credentials')
            }
        )
    )
    
    TOKEN_EXPIRED = openapi.Response(
        description="Token has expired",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, example='Token expired'),
                'code': openapi.Schema(type=openapi.TYPE_STRING, example='TOKEN_EXPIRED')
            }
        )
    )
    
    FORBIDDEN = openapi.Response(
        description="Forbidden - Insufficient permissions",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    example='You do not have permission'
                )
            }
        )
    )
    
    NOT_FOUND = openapi.Response(
        description="Not Found - Resource does not exist",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(type=openapi.TYPE_STRING, example='User not found')
            }
        )
    )
    
    SERVER_ERROR = openapi.Response(
        description="Internal Server Error",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'error': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    example='An unexpected error occurred'
                )
            }
        )
    )

# ========== Response Dictionaries for Different Endpoints ==========

# For Login endpoint
LOGIN_RESPONSES = {
    200: AuthResponses.LOGIN_SUCCESS,
    400: AuthResponses.BAD_REQUEST,
    401: AuthResponses.UNAUTHORIZED,
    500: AuthResponses.SERVER_ERROR,
}

# For Token Refresh endpoint
TOKEN_REFRESH_RESPONSES = {
    200: AuthResponses.TOKEN_REFRESH_SUCCESS,
    400: AuthResponses.BAD_REQUEST,
    401: AuthResponses.UNAUTHORIZED,
    500: AuthResponses.SERVER_ERROR,
}

# For Logout endpoint
LOGOUT_RESPONSES = {
    200: AuthResponses.LOGOUT_SUCCESS,
    400: AuthResponses.BAD_REQUEST,
    401: AuthResponses.UNAUTHORIZED,
    500: AuthResponses.SERVER_ERROR,
}

# For Profile endpoint
PROFILE_RESPONSES = {
    200: AuthResponses.PROFILE_SUCCESS,
    401: AuthResponses.UNAUTHORIZED,
    404: AuthResponses.NOT_FOUND,
    500: AuthResponses.SERVER_ERROR,
}

# For Token Verify endpoint
VERIFY_TOKEN_RESPONSES = {
    200: AuthResponses.TOKEN_VERIFY_SUCCESS,
    400: AuthResponses.BAD_REQUEST,
    401: AuthResponses.TOKEN_EXPIRED,
    500: AuthResponses.SERVER_ERROR,
}

# Common responses used across multiple endpoints
COMMON_RESPONSES = {
    400: AuthResponses.BAD_REQUEST,
    401: AuthResponses.UNAUTHORIZED,
    500: AuthResponses.SERVER_ERROR,
}