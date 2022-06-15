from typing import Optional
from enum import Enum
from datetime import datetime

from pydantic import BaseModel


class Sender(str, Enum):
    volunteer = 'volunteer'
    client = 'client'


class MessageBase(BaseModel):
    created_at: datetime
    content: str
    sender: Sender


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    pass


class SupportBase(BaseModel):
    questions: str
    client_id: int
    volunteer_id: Optional[int]
    messages: Optional[list[Message]]

    class Config:
        orm_mode = True


class SupportCreate(SupportBase):
    pass


class SupportThread(SupportBase):
    id: int


class VolunteerBase(BaseModel):
    tg_id: int

    class Config:
        orm_mode = True


class Volunteer(VolunteerBase):
    pass


class VolunteerCreate(VolunteerBase):
    pass
