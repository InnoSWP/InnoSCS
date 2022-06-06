from typing import Optional

from pydantic import BaseModel


class SupportBase(BaseModel):
    questions: list[str]


class SupportCreate(SupportBase):
    id: Optional[int] = None


class SupportThread(SupportBase):
    id: int


class VolunteerBase(BaseModel):
    id: int
    username: str
    thread_id: Optional[int] = None


class Volunteer(VolunteerBase):
    pass


class VolunteerCreate(VolunteerBase):
    pass
