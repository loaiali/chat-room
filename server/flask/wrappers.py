from flask import jsonify, request
from jwt import decode as jwtDecode
from functools import wraps
from appconfig import app_secret_key

class User(object):
    def __init__(self, username = None, email = None):
        self.name = username
        self.email = email
        
def user_required():
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            error = None
            setattr
            if 'x-access-token' in request.headers:
                token = request.headers['x-access-token']
                try:
                    data = jwtDecode(token, app_secret_key)
                except:
                    error = 'Token is invalid!', 401
            else:
                error = 'Token is missing!', 401
            if error:
                return error
            currUser = User(data["username"], data["password"])
            return fn(currUser, *args, **kwargs)
        decorated.__name__ = "{}_{}".format(decorated.__name__, fn.__name__)
        return decorated
    return wrapper