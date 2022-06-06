from pydantic import BaseModel


class SupportThread(BaseModel):
    id: int
    questions: list[str]


class Volunteer(BaseModel):
    id: int
    username: str
    thread_id: int
