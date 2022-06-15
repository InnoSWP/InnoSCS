from typing import SupportsIndex

import pytest_asyncio

from app.api.schemas import SupportCreate, VolunteerCreate
from app.api.services import SupportThreadService, VolunteerService


@pytest_asyncio.fixture
async def thread():
    thr = await SupportThreadService.create(
        SupportCreate(id=1, question='Test question', client_id=12345)
    )

    return thr


@pytest_asyncio.fixture
async def volunteer():
    vol = await VolunteerService.create(VolunteerCreate(tg_id=1, thread_id=2))

    return vol


@pytest_asyncio.fixture
async def volunteers(size: SupportsIndex = 10):
    vols = []
    for i in range(size):
        vol = await VolunteerService.create(VolunteerCreate(tg_id=i))
        vols.append(vol)

    return vols
