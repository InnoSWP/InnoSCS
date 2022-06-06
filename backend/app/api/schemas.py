from typing import Optional

from pydantic import BaseModel


class SupportBase(BaseModel):
    questions: list[str]


class SupportCreate(SupportBase):
    id: Optional[str] = None


class SupportThread(SupportBase):
    id: str


class VolunteerBase(BaseModel):
    id: int
    username: str
    thread_id: Optional[int] = None


class Volunteer(VolunteerBase):
    pass


class VolunteerCreate(VolunteerBase):
    pass
