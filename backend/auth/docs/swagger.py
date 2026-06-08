# authentication/docs/swagger.py
from drf_yasg import openapi

TOKEN_EXAMPLE = 'eyJhbGciOiJIUzI1NiIs...'

# ========== Request Schemas ==============

login_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['username', 'password'],
    properties={
        'username': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Username',
            example='john_doe'
        ),
        'password': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Password',
            example='SecurePass123!'
        ),
    }
)

token_refresh_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['refresh_token'],
    properties={
        'refresh_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Refresh token',
            example=TOKEN_EXAMPLE
        ),
    }
)

logout_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['refresh_token'],
    properties={
        'refresh_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Refresh token to blacklist',
            example=TOKEN_EXAMPLE
        ),
    }
)

verify_token_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['access_token'],
    properties={
        'access_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Access token to verify',
            example=TOKEN_EXAMPLE
        ),
    }
)

# ========== Response Schemas =====================

login_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'message': openapi.Schema(type=openapi.TYPE_STRING, example='login successful'),
        'access_token': openapi.Schema(type=openapi.TYPE_STRING),
        'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
        'user': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )
    }
)

profile_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'id': openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
        'username': openapi.Schema(type=openapi.TYPE_STRING, example='mary_smith'),
        'email': openapi.Schema(type=openapi.TYPE_STRING, example='mary@example.com'),
        'first_name': openapi.Schema(type=openapi.TYPE_STRING, example='Mary'),
        'last_name': openapi.Schema(type=openapi.TYPE_STRING, example='Smith'),
        'date_joined': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
        'last_login': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
        'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
    }
)

token_refresh_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'access_token': openapi.Schema(type=openapi.TYPE_STRING),
        'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
    }
)

verify_token_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'valid': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
    }
)

# Tag for grouping
AUTH_TAG = 'Authentication'# authentication/docs/swagger.py
from drf_yasg import openapi

# ========== Request Schemas (What client sends) ==========

login_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['username', 'password'],
    properties={
        'username': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Username',
            example='john_doe'
        ),
        'password': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Password',
            example='SecurePass123!'
        ),
    }
)

token_refresh_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['refresh_token'],
    properties={
        'refresh_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Refresh token',
            example=TOKEN_EXAMPLE
        ),
    }
)

logout_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['refresh_token'],
    properties={
        'refresh_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Refresh token to blacklist',
            example=TOKEN_EXAMPLE
        ),
    }
)

verify_token_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=['access_token'],
    properties={
        'access_token': openapi.Schema(
            type=openapi.TYPE_STRING, 
            description='Access token to verify',
            example=TOKEN_EXAMPLE
        ),
    }
)

# ========== Response Schemas (What server returns) ==========

login_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'message': openapi.Schema(type=openapi.TYPE_STRING, example='login successful'),
        'access_token': openapi.Schema(type=openapi.TYPE_STRING),
        'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
        'user': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )
    }
)

profile_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'id': openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
        'username': openapi.Schema(type=openapi.TYPE_STRING, example='mary_smith'),
        'email': openapi.Schema(type=openapi.TYPE_STRING, example='mary@example.com'),
        'first_name': openapi.Schema(type=openapi.TYPE_STRING, example='Mary'),
        'last_name': openapi.Schema(type=openapi.TYPE_STRING, example='Smith'),
        'date_joined': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
        'last_login': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
        'is_active': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
    }
)

token_refresh_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'access_token': openapi.Schema(type=openapi.TYPE_STRING),
        'refresh_token': openapi.Schema(type=openapi.TYPE_STRING),
    }
)

verify_token_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'valid': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
    }
)

AUTH_TAG = 'Authentication'