from typing import Optional

from pydantic import BaseModel


class SupportBase(BaseModel):
    questions: list[str]


class SupportCreate(SupportBase):
    ws_id: Optional[int] = None


class SupportThread(SupportBase):
    ws_id: int


class VolunteerBase(BaseModel):
    tg_id: int
    username: str
    thread_id: Optional[int] = None


class Volunteer(VolunteerBase):
    pass


class VolunteerCreate(VolunteerBase):
    pass
