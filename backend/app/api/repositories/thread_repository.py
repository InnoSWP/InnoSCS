import uuid
from typing import Optional

from app.api.schemas import Filter, Message, MessageCreate, SupportCreate, SupportThread

_threads: list[SupportThread] = []


class SupportThreadRepository:
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
    async def find_all(flt: Optional[Filter] = None) -> list[SupportThread]:
        """from function expected to return all thread entities from db"""
        if flt and flt == Filter.free:
            return [t for t in _threads if not t.volunteer_id]

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

        thread = await SupportThreadRepository.find_by_id(thread_id)
        _threads.remove(thread)  # type: ignore  # will be another implementation

        thread.messages.append(message_new)  # type: ignore  # will be another implementation
        _threads.append(thread)  # type: ignore  # will be another implementation

        return message_new

    @staticmethod
    async def delete(thread_id: int) -> None:
        thread = await SupportThreadRepository.find_by_id(thread_id)
        if thread:
            _threads.remove(thread)

    @staticmethod
    async def patch(thread: SupportCreate, thread_id: int) -> SupportThread:
        """
        from function expected that it will update all field of thread,
        volunteer is searched by telegram id
        """
        thread_to_upd = await SupportThreadRepository.find_by_id(thread_id)
        _threads.remove(thread_to_upd)  # type: ignore  # will be another implementation

        if thread.volunteer_id is not None:
            thread_to_upd.volunteer_id = thread.volunteer_id

        _threads.append(thread_to_upd)

        return thread_to_upd
