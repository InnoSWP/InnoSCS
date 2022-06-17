from http import HTTPStatus

import pytest

from app.api.schemas import VolunteerCreate


@pytest.mark.asyncio
async def test_create(client):
    tg_id = 2
    volunteer_new = VolunteerCreate(tg_id=tg_id)
    res = client.post('/volunteers', json=volunteer_new.dict())
    volunteer_crt = res.json()

    assert res.status_code == HTTPStatus.CREATED
    assert volunteer_crt
    assert volunteer_crt.get('tg_id') is not None
    assert volunteer_crt.get('tg_id') == tg_id


@pytest.mark.asyncio
async def test_find_all(client, volunteers):
    res = client.get('/volunteers')
    volunteers_res = res.json()

    assert res.status_code == HTTPStatus.OK
    assert len(volunteers_res) == len(volunteers)
    assert volunteers_res[0].get('tg_id') is not None
    assert volunteers_res[0].get('tg_id') == volunteers[0].tg_id


@pytest.mark.asyncio
async def test_find_all_free(client, volunteer, volunteers):
    res = client.get('/volunteers?flt=free')
    volunteers_res = res.json()

    assert res.status_code == HTTPStatus.OK
    assert len(volunteers_res) == len(volunteers)
    assert volunteers_res[0].get('tg_id') is not None
    assert volunteers_res[0].get('tg_id') == volunteers[0].tg_id
    assert volunteer.json() not in volunteers_res


@pytest.mark.asyncio
async def test_find_one(client, volunteer):
    res = client.get(f'/volunteers/{volunteer.tg_id}')
    volunteer_fnd = res.json()

    assert res.status_code == HTTPStatus.OK
    assert volunteer_fnd
    assert volunteer_fnd.get('tg_id') is not None
    assert volunteer_fnd.get('tg_id') == volunteer.tg_id


@pytest.mark.asyncio
async def test_find_non_existing(client):
    res = client.get('/volunteers/12312')

    assert res.status_code == HTTPStatus.NOT_FOUND


@pytest.mark.asyncio
async def test_update_one(client, volunteer):
    volunteer_to_upd = VolunteerCreate(tg_id=volunteer.tg_id + 1)
    res = client.put(f'/volunteers/{volunteer.tg_id}', json=volunteer_to_upd.dict())
    volunteer_upd = res.json()

    assert res.status_code == HTTPStatus.OK
    assert volunteer_upd
    assert volunteer_upd.get('tg_id') is not None
    assert volunteer_upd.get('tg_id') == volunteer.tg_id + 1
    assert volunteer_upd.get('thread_id') is None


@pytest.mark.asyncio
async def test_delete_one(client, volunteer):
    res = client.delete(f'/volunteers/{volunteer.tg_id}')
    res2 = client.get(f'/volunteers/{volunteer.tg_id}')

    assert res.status_code == HTTPStatus.OK
    assert res2.status_code == HTTPStatus.NOT_FOUND
