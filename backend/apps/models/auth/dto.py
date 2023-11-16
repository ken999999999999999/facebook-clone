from pydantic import BaseModel, EmailStr, Field, PastDate, validator
import re


class SignUpDto(BaseModel):
    email: EmailStr = Field(max_length=100)
    password: str = Field(
        description="Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character")
    display_name: str = Field(max_length=100)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    birthdate: PastDate = Field(...)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "email": "example@email.com",
                "password": "password123",
                "display_name": "Helle word",
                "first_name": "Hello",
                "last_name": "World",
                "birthdate": "2000-01-01"
            }
        }

    @validator('password')
    def password_strength(cls, value):
        pattern = re.compile(
            r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
        if not pattern.match(value):
            raise ValueError(
                'Password must be at least 8 characters long, include a letter, a number, and a special character (@$!%*?&)')
        return value
