from typing import Optional

from app.api.schemas import Filter, Volunteer, VolunteerCreate

_volunteers: list[Volunteer] = []


class VolunteerRepository:
    """
    class for manipulation Volunteer entities.
    Note: some functions should return exactly pydantic model!
    """

    @staticmethod
    async def create(volunteer: VolunteerCreate) -> Volunteer:
        """
        :param volunteer: new `VolunteerCreate`
        :return: new `Volunteer`
        """
        volunteer_new = Volunteer(
            tg_id=volunteer.tg_id,
        )
        _volunteers.append(volunteer_new)

        return volunteer_new

    @staticmethod
    async def find_all(flt: Optional[Filter] = None) -> list[Volunteer]:
        """
        :param flt: filter to sort list of `Volunteer`
        :return: list of `Volunteer`
        """

        return _volunteers

    @staticmethod
    async def find_by_tg_id(volunteer_tg_id: int) -> Optional[Volunteer]:
        """
        :param volunteer_tg_id: id of the volunteer to find
        :return: `Volunteer`
        """
        for volunteer in _volunteers:
            if volunteer.tg_id == volunteer_tg_id:
                return volunteer

        return None

    @staticmethod
    async def update(volunteer: VolunteerCreate, volunteer_tg_id: int) -> Volunteer:
        """
        :param volunteer:
        :param volunteer_tg_id:
        :return:
        """
        volunteer_to_upd = await VolunteerRepository.find_by_tg_id(volunteer_tg_id)
        _volunteers.remove(volunteer_to_upd)  # type: ignore  # will be another implementation

        volunteer_upd = Volunteer(
            tg_id=volunteer.tg_id,
        )
        _volunteers.append(volunteer_upd)

        return volunteer_upd

    @staticmethod
    async def delete(volunteer_id: int) -> None:
        volunteer = await VolunteerRepository.find_by_tg_id(volunteer_id)

        if volunteer:
            _volunteers.remove(volunteer)
