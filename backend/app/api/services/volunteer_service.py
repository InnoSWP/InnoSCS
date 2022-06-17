from typing import Optional

from app.api.schemas import Filter, Volunteer, VolunteerCreate

_volunteers: list[Volunteer] = []


class VolunteerService:
    """
    class for manipulation Volunteer entities.
    Note: some functions should return exactly pydantic model!
    """

    @staticmethod
    async def create(volunteer: VolunteerCreate) -> Volunteer:
        """from function expected that it will store the volunteer in db"""
        volunteer_new = Volunteer(
            tg_id=volunteer.tg_id,
            thread_id=volunteer.thread_id,
        )
        _volunteers.append(volunteer_new)

        return volunteer_new

    @staticmethod
    async def find_all(flt: Optional[Filter] = None) -> list[Volunteer]:
        """
        from function expected to return all volunteer from db or free volunteers,
        flt - filter
        """
        if flt and flt == Filter.free:
            return [
                volunteer for volunteer in _volunteers if volunteer.thread_id is None
            ]

        return _volunteers

    @staticmethod
    async def find_by_tg_id(volunteer_tg_id: int) -> Optional[Volunteer]:
        """from function expected that it will return volunteer by telegram id"""
        for volunteer in _volunteers:
            if volunteer.tg_id == volunteer_tg_id:
                return volunteer

        return None

    @staticmethod
    async def update(volunteer: VolunteerCreate, volunteer_tg_id: int) -> Volunteer:
        """
        from function expected that it will update all field of volunteer,
        volunteer is searched by telegram id
        """
        volunteer_to_upd = await VolunteerService.find_by_tg_id(volunteer_tg_id)
        _volunteers.remove(volunteer_to_upd)  # type: ignore  # will be another implementation

        volunteer_upd = Volunteer(
            tg_id=volunteer.tg_id,
            thread_id=volunteer.thread_id,
        )
        _volunteers.append(volunteer_upd)

        return volunteer_upd

    @staticmethod
    async def delete(volunteer_id: int) -> None:
        volunteer = await VolunteerService.find_by_tg_id(volunteer_id)

        if volunteer:
            _volunteers.remove(volunteer)
