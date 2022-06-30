from http import HTTPStatus

import pytest

from app.api.schemas import SupportThreadCreate, SupportThreadPatch

THREAD_URL = 'threads'


@pytest.mark.asyncio
async def test_find_all(client, thread):
    res = client.get(f'/{THREAD_URL}')
    threads = res.json()

    assert res.status_code == HTTPStatus.OK
    assert threads
    assert len(threads) == 1
    assert threads[0]['question'] == thread.question


@pytest.mark.asyncio
async def test_create(client):
    thread_to_crt = SupportThreadCreate(question='Test question')
    res = client.post(f'/{THREAD_URL}', json=thread_to_crt.dict())
    threed_crt = res.json()

    assert res.status_code == HTTPStatus.CREATED
    assert threed_crt
    assert threed_crt['question'] == thread_to_crt.question


@pytest.mark.asyncio
async def test_patch(client, thread):
    thread_to_upd = SupportThreadPatch(volunteer_id=1)
    res = client.patch(f'/{THREAD_URL}/{thread.id}', json=thread_to_upd.dict())
    thread_upd = res.json()

    assert res.status_code == HTTPStatus.OK
    assert thread_upd
    assert thread_upd.get('volunteer_id') is not None
    assert thread_upd.get('volunteer_id') == 1


@pytest.mark.asyncio
async def test_delete(client, thread):
    res = client.delete(f'/{THREAD_URL}/{thread.id}')
    res2 = client.get('/threads')
    threads = res2.json()

    assert res.status_code == HTTPStatus.OK
    assert res2.status_code == HTTPStatus.OK
    assert threads == []


@pytest.mark.asyncio
async def test_websocket_broadcast(client, thread):
    with client.websocket_connect(f'ws/{thread.id}') as ws1:
        with client.websocket_connect(f'ws/{thread.id}') as ws2:
            ws1.send_text(thread.question)
            res = ws2.receive_text()

    assert res == thread.question
