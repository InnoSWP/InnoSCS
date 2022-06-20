from typing import SupportsIndex

import pytest_asyncio

from app.api.repositories import SupportThreadRepository, VolunteerRepository
from app.api.schemas import SupportCreate, VolunteerCreate


@pytest_asyncio.fixture
async def thread():
    thr = await SupportThreadRepository.create(
        SupportCreate(id=1, question='Test question', client_id=12345)
    )

    return thr


@pytest_asyncio.fixture
async def volunteer():
    vol = await VolunteerRepository.create(VolunteerCreate(tg_id=1, thread_id=2))

    return vol


@pytest_asyncio.fixture
async def volunteers(size: SupportsIndex = 10):
    vols = []
    for i in range(size):
        vol = await VolunteerRepository.create(VolunteerCreate(tg_id=i))
        vols.append(vol)

    return vols
