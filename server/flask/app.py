from flask import Flask
from flask_socketio import SocketIO
from dbmanager import DBManager
from appconfig import app_secret_key

app = Flask(__name__)
app.config['SECRET_KEY'] = app_secret_key
io = SocketIO(app)
db = DBManager("ChatDB")
