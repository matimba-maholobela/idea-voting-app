from django.core.validators import MinLengthValidator, RegexValidator
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_]{3,20}$',
                message='Username must be 3-20 alphanumeric characters or underscores',
                code='invalid_username'
            )
        ]
    )
    password = serializers.CharField(
        write_only=True,
        validators=[
            MinLengthValidator(8, message="Password must be at least 8 characters"),
            RegexValidator(
                regex=r'\d',
                message='Password must contain at least one digit',
                code='no_digit'
            ),
            RegexValidator(
                regex=r'[A-Z]',
                message='Password must contain at least one uppercase letter',
                code='no_uppercase'
            ),
            RegexValidator(
                regex=r'[a-z]',
                message='Password must contain at least one lowercase letter',
                code='no_lowercase'
            ),
            RegexValidator(
                regex=r'[!@#$%^&*(),.?":{}|<>]',
                message='Password must contain at least one special character',
                code='no_special'
            ),
        ]
    )