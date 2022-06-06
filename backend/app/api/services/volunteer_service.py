from typing import Optional

from app.api.schemas import Volunteer, VolunteerCreate


_volunteers: list[Volunteer] = []


class VolunteerService:
    """class for manipulation Volunteer entities. Note: some functions should return exactly pydantic model!"""

    @staticmethod
    async def create(volunteer: VolunteerCreate) -> Volunteer:
        """from function expected that it will store the volunteer in db"""
        volunteer_new = Volunteer(id=volunteer.id, thread_id=volunteer.thread_id, username=volunteer.username)
        _volunteers.append(volunteer_new)

        return volunteer_new

    @staticmethod
    async def find_all(flt: str) -> list[Volunteer]:
        """from function expected to return all volunteer from db or free volunteers, flt - filter"""
        if flt and flt == 'free':
            return [volunteer for volunteer in _volunteers if volunteer.thread_id is None]

        return _volunteers

    @staticmethod
    async def find_by_id(volunteer_id: int) -> Optional[Volunteer]:
        """from function expected that it will return volunteer by id"""
        for volunteer in _volunteers:
            if volunteer.id == volunteer_id:
                return volunteer

        return None

    @staticmethod
    async def update(volunteer: VolunteerCreate, volunteer_id: int) -> Volunteer:
        """from function expected that it will update all field of volunteer"""
        volunteer_to_upd = await VolunteerService.find_by_id(volunteer_id)
        _volunteers.remove(volunteer_to_upd)

        volunteer_upd = Volunteer(id=volunteer.id, username=volunteer.username, thread_id=Volunteer.thread_id)
        _volunteers.append(volunteer_upd)

        return volunteer_upd

