import uuid
from typing import Optional

from app.api.schemas import Message, MessageCreate, SupportCreate, SupportThread

_threads: list[SupportThread] = []


class SupportThreadService:
    """
    class for manipulation SupportThread entities.
    Note: some functions should return exactly pydantic model!
    """

    @staticmethod
    async def create(thread: SupportCreate) -> SupportThread:
        """from function expected that it will store the thread in db"""
        thread.id = uuid.uuid4().int
        thread_new = SupportThread(id=thread.id, question=thread.question)
        _threads.append(thread_new)

        return thread_new

    @staticmethod
    async def find_all() -> list[SupportThread]:
        """from function expected to return all thread entities from db"""
        return _threads

    @staticmethod
    async def find_by_id(thread_id: int) -> Optional[SupportThread]:
        """from function expected that it will return SupportThread by id"""
        for thread in _threads:
            if thread.id == thread_id:
                return thread

        return None

    @staticmethod
    async def create_message(message: MessageCreate, thread_id: int) -> Message:
        """
        from function expected that it will store message for
        specific thread
        """

        message_new = Message(
            created_at=message.created_at,
            content=message.content,
            sender=message.sender,
        )

        thread = await SupportThreadService.find_by_id(thread_id)
        _threads.remove(thread)  # type: ignore  # will be another implementation

        thread.messages.append(message_new)  # type: ignore  # will be another implementation
        _threads.append(thread)  # type: ignore  # will be another implementation

        return message_new

    @staticmethod
    async def delete(thread_id: int) -> None:
        thread = await SupportThreadService.find_by_id(thread_id)
        if thread:
            _threads.remove(thread)

    @staticmethod
    async def update(thread: SupportCreate, thread_id: int) -> SupportThread:
        """
        from function expected that it will update all field of thread,
        volunteer is searched by telegram id
        """
        thread_to_upd = await SupportThreadService.find_by_id(thread_id)
        _threads.remove(thread_to_upd)  # type: ignore  # will be another implementation

        thread_upd = SupportThread(
            id=thread_id,
            question=thread.question,
            client_id=thread.client_id,
            volunteer_id=thread.volunteer_id,
            messages=thread.messages,
        )

        _threads.append(thread_upd)

        return thread_upd
