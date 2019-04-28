from app import io as socketio, db as mydb
from flask import request
from flask_socketio import join_room, leave_room
from bson import ObjectId
from wrappers import auth_required
from apputil import isRoomOwner
# TODO: for auth_required, It is better to use flask_login module to help authenticating the user in the session without the overhead of sending the token each time we message


@socketio.on('signedIn')
@auth_required()
def signedIn(user, data):  # tested = true
    print(f"Entered signed in with id {user.name}")
    SID = request.sid
    print("++++++++++++++++++SID+++++++++++++++++", SID)
    mydb.updateSID(user.name, SID)
    rooms = mydb.getAllRoomsOfUser(user.name)
    for room in rooms:
        print(f"joining user {user.name} to room {room['_id']}")
        join_room(room["_id"])


#event handler to remove  user from a certain room
@socketio.on('removeUser')
@auth_required()
def removeUser(user, data):
    userIdToRemove = data["userId"]
    roomId = data["roomId"]
    currUserId = user.name
    if not isRoomOwner(currUserId, roomId):
        print(
            f"[AUTH WARN]: user {currUserId} tried to remove user from room he is not the owner of it"
        )
        return
    userSIDToRemove = mydb.getUserSID(userIdToRemove)
    print(f"removing {userIdToRemove} from {roomId}")
    if userSIDToRemove != "":
        leave_room(roomId, sid=userSIDToRemove)
    mydb.removeUserfromRoom(userIdToRemove, roomId)


@socketio.on('addUser')
@auth_required()
def addUserToRoom(user, data):
    roomId = data["roomId"]
    targetUserId = data["userId"]
    if not isRoomOwner(user.name, roomId):
        print(
            f"[AUTH WARN]: user {user.name} tried to add user to room he is not the owner of it"
        )
        return
    print(f"adding {targetUserId} to the room with ID {roomId}")
    mydb.addUserToRoom(roomId, targetUserId)

    targetUserSID = mydb.getUserSID(targetUserId)
    print(f"adding {targetUserSID} to {roomId}")
    join_room(roomId, sid=targetUserSID)


#event handler to make a certain user leave a room
@socketio.on('leaveRoom')
@auth_required()
def leaveRoom(userId, roomId):
    mydb.removeUserfromRoom(userId, roomId)
    leave_room(roomId)
    print(f"leaving from the room with {roomId}")


@socketio.on('disconnect')
def disconnect():
    SID = request.sid
    print("disconnect: ", SID)
    mydb.removeSID(SID)


@socketio.on('sendMessage')
@auth_required()
def sendMessage(user, data):  # tested = true
    # print("in sendMessage: params:", user, data)
    print(f"message received from {user.name}: {data}")
    # TODO: make sure that this user is in this room
    roomId = ObjectId(data["room"])
    del data["room"]
    mydb.addMessageToRoom(roomId, user.name, data)
    data["user"] = user.name
    print(f"emitting to {str(roomId)} {data}")
    socketio.emit('show-message', data, room=str(roomId), include_self=False)


@socketio.on_error_default
def error_handler(e):
    print('An error has occurred: ', str(e), type(e))
