from http import HTTPStatus

import pytest

from app.api.schemas import SupportCreate


@pytest.mark.asyncio
async def test_find_all(client, thread):
    res = client.get('/threads')
    threads = res.json()

    assert res.status_code == HTTPStatus.OK
    assert threads
    assert len(threads) == 1
    assert threads[0]['question'] == thread.question


@pytest.mark.asyncio
async def test_create(client):
    thread_to_crt = SupportCreate(question='Test question')
    res = client.post('/threads', json=thread_to_crt.dict())
    threed_crt = res.json()

    assert res.status_code == HTTPStatus.CREATED
    assert threed_crt
    assert threed_crt['question'] == thread_to_crt.question


@pytest.mark.asyncio
async def test_update(client, thread):
    thread_to_upd = SupportCreate(question=thread.question, volunteer_id=1)
    res = client.put(f'/threads/{thread.id}', json=thread_to_upd.dict())
    thread_upd = res.json()

    assert res.status_code == HTTPStatus.OK
    assert thread_upd
    assert thread_upd.get('volunteer_id') is not None
    assert thread_upd.get('volunteer_id') == 1


@pytest.mark.asyncio
async def test_delete(client, thread):
    res = client.delete(f'/threads/{thread.id}')
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
