from http import HTTPStatus
from typing import Optional

from fastapi import APIRouter

from app.api.schemas import Volunteer, VolunteerCreate
from app.api.services import VolunteerService

router = APIRouter()


@router.post('/volunteers', response_model=Volunteer, status_code=HTTPStatus.CREATED)
async def create_volunteer(volunteer: VolunteerCreate) -> Volunteer:
    volunteer_new = await VolunteerService.create(volunteer)

    return volunteer_new


@router.get('/volunteers', response_model=list[Volunteer])
async def find_volunteers(flt: Optional[str] = None) -> list[Volunteer]:
    volunteers = await VolunteerService.find_all(flt)

    return volunteers


@router.put('/volunteer/{volunteer_tg_id}', response_model=Volunteer)
async def update_volunteer(
    volunteer_tg_id: int, volunteer: VolunteerCreate
) -> Volunteer:
    volunteer_upd = await VolunteerService.update(volunteer, volunteer_tg_id)

    return volunteer_upd
