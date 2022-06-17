from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter

from app.api.exceptions import EntityNotFound
from app.api.schemas import Volunteer, VolunteerCreate
from app.api.services import VolunteerService

router = APIRouter()


@router.post('/volunteers', response_model=Volunteer, status_code=HTTPStatus.CREATED)
async def create_volunteer(volunteer: VolunteerCreate) -> Volunteer:
    volunteer_new = await VolunteerService.create(volunteer)

    return volunteer_new


@router.get('/volunteers', response_model=list[Volunteer])
async def find_all_volunteers(flt: Optional[str] = None) -> list[Volunteer]:
    volunteers = await VolunteerService.find_all(flt)

    return volunteers


@router.get('/volunteers/{volunteer_tg_id}', response_model=Volunteer)
async def find_volunteer(volunteer_tg_id: int) -> Volunteer:
    volunteer = await VolunteerService.find_by_tg_id(volunteer_tg_id)

    if not volunteer:
        raise EntityNotFound('volunteer')

    return volunteer


@router.put('/volunteers/{volunteer_id}', response_model=Volunteer)
async def update_volunteer(volunteer_id: int, volunteer: VolunteerCreate) -> Volunteer:
    volunteer_upd = await VolunteerService.update(volunteer, volunteer_id)

    return volunteer_upd


@router.delete('/volunteers/{volunteer_id}')
async def update_volunteer(volunteer_id: int) -> None:
    await VolunteerService.delete(volunteer_id)
