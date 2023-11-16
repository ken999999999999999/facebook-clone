from fastapi import HTTPException, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from apps.models.auth.dto import SignUpDto

security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        # Verify the token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(
            id_token=credentials.credentials, check_revoked=True)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def create_user(display_name: str, email: str, password: str):
    try:
        firebase_user = auth.get_user_by_email(email)
    except auth.UserNotFoundError:
        firebase_user = auth.create_user(
            display_name=display_name,
            email=email,
            password=password
        )
    return firebase_user
