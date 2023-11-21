from datetime import date
from pydantic import BaseModel, EmailStr, Field, PastDate, validator
import re


class UserDto(BaseModel):
    id: str
    email: str
    display_name: str
    first_name: str
    last_name: str
    birthdate: date


class CreateUserCommand(BaseModel):
    email: EmailStr = Field(..., max_length=100)
    password: str = Field(...,
                          description="Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character")
    display_name: str = Field(..., max_length=100)
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    birthdate: PastDate = Field(...)

    @validator('password')
    def password_strength(cls, value):
        pattern = re.compile(
            r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
        if not pattern.match(value):
            raise ValueError(
                'Password must be at least 8 characters long, include a letter, a number, and a special character (@$!%*?&)')
        return value
