from app import app, db as mydb
from flask import render_template, jsonify, request
from wrappers import user_required,auth_required
import jwt
import datetime
from cors import crossdomain, cors_enabled
from flask_cors import cross_origin

@app.route('/login', methods=["GET"])
@cross_origin()
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return jsonify({'mes': "you should enter username and password"}), 400
    userRecord = mydb.retrieveOne({"_id": auth.username})
    print(auth.username, auth.password)
    if not userRecord or userRecord["password"] != auth.password:
        return jsonify({'err': "no such user"})
    token = jwt.encode({'username': auth.username, "password": auth.password, "email": "",
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)}, app.config['SECRET_KEY'])
    return jsonify({'token': token.decode('UTF-8')})

@app.route('/signup', methods=['post'])
@cross_origin()
def signup():
    body = request.get_json()
    name, email, password = body["name"], body["email"], body["password"]
    id = mydb.insertUser(name, password, email)
    if not id:
        return jsonify({'err': "this user already exists"})
    token = jwt.encode({'username': name, "password": password, "email": email,
                            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)}, app.config['SECRET_KEY'])
    return jsonify({'token': token.decode('UTF-8'), 'id': id})


@app.route('/rooms/<roomId>')
@cross_origin()
@user_required()
def getRoomInfo(user, roomId):
    # TODO: check here that the user is in that room
    roomInfo = mydb.getAllMessagesOfRoom(roomId)
    return jsonify({"data": roomInfo})


@app.route("/rooms", methods=['post'])
@cross_origin()
@user_required()
def createNewRoom(user):
    body = request.get_json()
    roomName = body["name"]
    roomId = mydb.createRoom(roomName, user.name).inserted_id
    return jsonify({"_id": str(roomId), "roomName": roomName})


@app.route('/user/rooms')
@cross_origin()
@user_required()
def getUserRooms(user):
    '''
        return all rooms, this user is in
    '''
    print(user.name)
    rooms = mydb.getAllRoomsOfUser(user.name)
    return jsonify({"data": rooms})

@app.route('/user/created-rooms')
@cross_origin()
@user_required()
def getCreatedRooms(user):
    '''
        return all rooms, this user create
    '''
    print(user.name)
    rooms = mydb.retrieveAll({"creator":user.name})
    return jsonify({"data": rooms})

@app.route('/<roomId>/users')
@user_required()
def getUsersOfRooms(user,roomId):
    print(f"getting users of room with Id {roomId}")
    return jsonify({"users":mydb.getUsersOfRoom(roomId)})