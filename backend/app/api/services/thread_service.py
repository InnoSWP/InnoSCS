from typing import Optional

from app.api.schemas import SupportCreate, SupportThread

_threads: list[SupportThread] = []


class SupportThreadService:
    """
    class for manipulation SupportThread entities.
    Note: some functions should return exactly pydantic model!
    """

    @staticmethod
    async def create(thread: SupportCreate) -> SupportThread:
        """from function expected that it will store the thread in db"""
        thread_new = SupportThread(ws_id=thread.ws_id, questions=thread.questions)
        _threads.append(thread_new)

        return thread_new

    @staticmethod
    async def find_all() -> list[SupportThread]:
        """from function expected to return all thread entities from db"""
        return _threads

    @staticmethod
    async def find_by_ws_id(ws_id: int) -> Optional[SupportThread]:
        """from function expected that it will return SupportThread"""
        for thread in _threads:
            if thread.ws_id == ws_id:
                return thread

        return None

    @staticmethod
    async def save_question(question: str, ws_id: int) -> None:
        """
        from function expected that it will add questions in ws_id,
        by question is meant messages from acclient and a volunteer
        """
        thread = await SupportThreadService.find_by_ws_id(ws_id)
        _threads.remove(thread)  # type: ignore  # will be another implementation

        thread.questions.append(question)  # type: ignore  # will be another implementation
        _threads.append(thread)  # type: ignore  # will be another implementation
