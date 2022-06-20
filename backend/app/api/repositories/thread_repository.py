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
        """
        :param thread: new`SupportCreate`
        :return: new `SupportThread`
        """
        thread.id = uuid.uuid4().int
        thread_new = SupportThread(id=thread.id, question=thread.question)
        _threads.append(thread_new)

        return thread_new

    @staticmethod
    async def find_all(flt: Optional[Filter] = None) -> list[SupportThread]:
        """
        :param flt: filter to sort list of `SupportThread`
        :return: list of `SupportThread`
        """
        if flt and flt == Filter.free:
            return [t for t in _threads if t.volunteer_id is not None]

        return _threads

    @staticmethod
    async def find_by_id(thread_id: int) -> Optional[SupportThread]:
        """
        :param thread_id: id of the thread to find
        :return: `SupportThread`
        """
        for thread in _threads:
            if thread.id == thread_id:
                return thread

        return None

    @staticmethod
    async def create_message(message: MessageCreate, thread_id: int) -> Message:
        """
        :param message: new `MessageCreate`
        :param thread_id: id of the thread in which to save the message
        :return: new `Message`
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
        if thread is not None:
            _threads.remove(thread)

    @staticmethod
    async def patch(thread: SupportCreate, thread_id: int) -> SupportThread:
        """
        :param thread: updated `SupportCreate`
        :param thread_id: id of the thread to be updated
        :return: updated `SupportThread`
        """
        thread_to_upd = await SupportThreadRepository.find_by_id(thread_id)
        _threads.remove(thread_to_upd)  # type: ignore  # will be another implementation

        if thread.volunteer_id is not None:
            thread_to_upd.volunteer_id = thread.volunteer_id

        _threads.append(thread_to_upd)

        return thread_to_upd
