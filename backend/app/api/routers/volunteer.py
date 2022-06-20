from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter

from app.api.exceptions import EntityNotFound
from app.api.schemas import Filter, Volunteer, VolunteerCreate
from app.api.repositories import VolunteerRepository

router = APIRouter()


@router.post('/volunteers', response_model=Volunteer, status_code=HTTPStatus.CREATED)
async def create_volunteer(volunteer: VolunteerCreate) -> Volunteer:
    volunteer_new = await VolunteerRepository.create(volunteer)

    return volunteer_new


@router.get('/volunteers', response_model=list[Volunteer])
async def find_all_volunteers(flt: Optional[Filter] = None) -> list[Volunteer]:
    volunteers = await VolunteerRepository.find_all(flt)

    return volunteers


@router.get('/volunteers/{volunteer_tg_id}', response_model=Volunteer)
async def find_volunteer(volunteer_tg_id: int) -> Volunteer:
    volunteer = await VolunteerRepository.find_by_tg_id(volunteer_tg_id)

    if not volunteer:
        raise EntityNotFound('volunteer')

    return volunteer


@router.put('/volunteers/{volunteer_id}', response_model=Volunteer)
async def update_volunteer(volunteer_id: int, volunteer: VolunteerCreate) -> Volunteer:
    volunteer_upd = await VolunteerRepository.update(volunteer, volunteer_id)

    return volunteer_upd


@router.delete('/volunteers/{volunteer_id}')
async def delete_volunteer(volunteer_id: int) -> None:
    await VolunteerRepository.delete(volunteer_id)
