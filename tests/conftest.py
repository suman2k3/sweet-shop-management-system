import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from main import app
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)
