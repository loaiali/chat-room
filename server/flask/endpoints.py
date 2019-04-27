from app import app, db as mydb
from flask import render_template, jsonify, request
from wrappers import user_required
import jwt
import datetime

@app.route('/login')
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'mes': "you should enter username and password"}), 400
    # TODO: make sure that this user exists
    token = jwt.encode({'username': auth.username, "password": auth.password,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)}, app.config['SECRET_KEY'])
    return jsonify({'token': token.decode('UTF-8')})


@app.route('/rooms/<roomId>')
def getRoomInfo(roomId):
    roomInfo = mydb.getAllMessagesOfRoom(roomId)
    return jsonify({"data": roomInfo})



#? TODO: this should be socket.io
@app.route('/rooms/<roomId>/new-user/<userId>')
def addUserToRoom(roomId,userId):
    mydb.addUserToRoom(roomId,userId)
    print(f"adding {userId} to the room with ID {roomId}")
    return jsonify({"mes": "new user is added successfully"})

@app.route("/rooms", methods=['post'])
@user_required()
def createNewRoom(user):
    body = request.get_json()
    roomName = body["name"]
    roomId = mydb.createRoom(roomName, user.name).inserted_id
    return jsonify({"id": str(roomId)})


@app.route('/user/rooms')
@user_required()
def getUserRooms(user):
    '''
        return all rooms, this user is in
    '''
    print(user.name)
    rooms = mydb.getAllRoomsOfUser(user.name)
    return jsonify({"data": rooms})

@app.route('/user/rooms')
@user_required()
def getCreatedRooms(user):
    '''
        return all rooms, this user create
    '''
    print(user.name)
    rooms = mydb.retrieveAll({"creator":user.name})
    return jsonify({"data": rooms})
