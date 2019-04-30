from app import io as socketio, db as mydb
from flask import request
from flask_socketio import join_room, leave_room
from bson import ObjectId
from wrappers import auth_required, log
from apputil import isRoomOwner
# TODO: for auth_required, It is better to use flask_login module to help authenticating the user in the session without the overhead of sending the token each time we message


@socketio.on('signedIn')
@auth_required()
def signedIn(user, data):  # tested = true
    print(f"Entered signed in with id {user.name}")
    SID = request.sid
    print("++++++++++++++++++SID+++++++++++++++++", SID)
    mydb.updateSID(user.name, SID)
    rooms = mydb.getUserRooms(user.name)
    for room in rooms:
        print(f"joining user {user.name} to room {room['_id']}")
        join_room(room["_id"])

#event handler to remove  user from a certain room
@socketio.on('removeUser')
@auth_required()
def removeUser(user, data):
    targetUserId = data["userId"]
    roomId = data["roomId"]
    print(type(user),targetUserId,roomId)
    print(f"removing {targetUserId} From {roomId}++++++++++++++++++++++++++")
    existingUsers = mydb.getUsersOfRoom(roomId)
    if not (targetUserId in existingUsers):
        print("removing already removed", existingUsers)
        return
    currUserId =user.name
    if not isRoomOwner(currUserId, roomId) and currUserId != targetUserId:
        print(
            f"[AUTH WARN]: user {currUserId} tried to remove user from room he is not the owner of it"
        )
        return
    userSIDToRemove = mydb.getUserSID(targetUserId)
    mydb.removeUserfromRoom(targetUserId, roomId)
    socketio.emit("userRemoved",{"userId":targetUserId, "roomId": roomId}, room=str(roomId))    
    if userSIDToRemove != "":
        leave_room(roomId, sid=userSIDToRemove)
    


@socketio.on('addUser')
@auth_required()
@log("websocket")
def addUserToRoom(user, data):
    roomId = data["roomId"]
    targetUserId = data["userId"]
    if not isRoomOwner(user.name, roomId):
        print(
            f"[AUTH WARN]: user {user.name} tried to add user to room he is not the owner of it"
        )
        return
    print(f"adding {targetUserId} to the room with ID {roomId}")
    existingUsers = mydb.getUsersOfRoom(roomId)
    if targetUserId in existingUsers:
        print(f"user {targetUserId} is already on this room")
        return
    
    targetUserSID = mydb.getUserSID(targetUserId)
    mydb.addUserToRoom(roomId, targetUserId)
    print(f"added to the db")
    roomInfo = mydb.getRoomInfoNoMessages(roomId)

    print(f"emitting to the room members that new user has joined the room")
    socketio.emit("userJoined", {"userId": targetUserId, "roomId": roomId}, room=str(roomId))
    if targetUserSID!="":
        join_room(roomId, sid=targetUserSID)
        print("emitting to the new user, to add the room")
        socketio.emit("newRoom", roomInfo, room=targetUserSID)
    

#event handler to make a certain user leave a room
# @socketio.on('leaveRoom')
# @auth_required()
# def leaveRoom(userId, roomId):
#     print(f"leaving from the room with {roomId}")
#     mydb.removeUserfromRoom(userId.name, roomId["roomId"])
#     socketio.emit("UserRemoved",{"UserId":userId.name},room=str(roomId))
#     leave_room(roomId["roomId"])
    


@socketio.on('disconnect')
@log("websocket")
def disconnectClient():
    return
    pass
    SID = request.sid
    mydb.removeSID(SID)


@socketio.on('sendMessage')
@auth_required()
@log("websocket")
def sendMessage(user, data):  # tested = true
    print(f"message received from {user.name}: {data}")
    # TODO: make sure that this user is in this room
    roomId = ObjectId(data["room"])
    # del data["room"]
    mydb.addMessageToRoom(roomId, user.name, data)
    data["user"] = user.name
    print(f"emitting to room {str(roomId)} {data}")
    socketio.emit('show-message', data, room=str(roomId), include_self=False)


@socketio.on_error_default
def error_handler(e):
    print('An error has occurred: ', str(e), type(e))
