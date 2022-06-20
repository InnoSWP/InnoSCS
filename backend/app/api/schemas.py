from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class Filter(str, Enum):
    free = 'free'


class Sender(str, Enum):
    volunteer = 'volunteer'
    client = 'client'


class MessageBase(BaseModel):
    created_at: datetime
    content: str
    sender: Optional[Sender]  # TODO: add recognize service, fields must be not optional


class MessageCreate(MessageBase):
    pass


class Message(MessageBase):
    pass


class SupportBase(BaseModel):
    question: str
    client_id: Optional[int]  # TODO: add recognize service, fields must be not optional
    volunteer_id: Optional[int]
    messages: Optional[list[Message]] = []

    class Config:
        orm_mode = True


class SupportCreate(SupportBase):
    id: Optional[int]


class SupportThread(SupportBase):
    id: int


class VolunteerBase(BaseModel):
    tg_id: int
    thread_id: Optional[int]

    class Config:
        orm_mode = True


class Volunteer(VolunteerBase):
    pass


class VolunteerCreate(VolunteerBase):
    pass
