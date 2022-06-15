import pytest
import pytest_asyncio
from fastapi.testclient import TestClient

from app.api import create_app
from app.api.services.thread_service import _threads
from app.api.services.volunteer_service import _volunteers


@pytest_asyncio.fixture(autouse=True)
async def _init_db():
    _volunteers.clear()
    _threads.clear()
    yield
    _threads.clear()
    _volunteers.clear()


@pytest.fixture
def client():
    _client = TestClient(create_app())
    return _client
