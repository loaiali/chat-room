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



from app import io
from flask_socketio import emit
def auth_required():
    def wrapper(fn):
        @wraps(fn)
        def decorated(data, *args, **kwargs):
            try:
                print("decorated in auth_required", data, *args)
                token = data["token"]
                print("decorated in auth_required", token)
                userData = jwtDecode(token, app_secret_key)
                currUser = User(username = userData["username"])
                del data["token"]
            except Exception as e:
                print("auth_required: a user tried to send message without valid auth")
                print(e, type(e))
                emit("Error", {"mes": "invalid auth"}, broadcast=False)
            return fn(currUser, data, *args, **kwargs)
        decorated.__name__ = "{}_{}".format(decorated.__name__, fn.__name__)
        return decorated
    return wrapper