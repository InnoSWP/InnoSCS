from typing import Optional

from app.api.schemas import SupportThread


_threads: list[SupportThread] = []


class SupportThreadService:
    """class for manipulation SupportThread entities. Note: some functions should return exactly pydantic model"""

    @staticmethod
    async def create(thread: SupportThread) -> None:
        """from function expected to store the thread in db"""

        _threads.append(thread)

    @staticmethod
    async def find_all() -> list[SupportThread]:
        """from function expected to return all thread entities from db"""
        return _threads

    @staticmethod
    async def find_by_id(thread_id: int) -> Optional[SupportThread]:
        """from function expected that it will return SupportThread"""
        for thread in _threads:
            if thread.id == thread_id:
                return thread

        return None

    @staticmethod
    async def save_question(question: str, thread_id):
        """from function expected that it will add questions in thread_id, by question is meant messages from a
        cclient and a volunteer
        """
        thread = await SupportThreadService.find_by_id(thread_id)
        _threads.remove(thread)

        thread.questions.append(question)
        _threads.append(thread)




