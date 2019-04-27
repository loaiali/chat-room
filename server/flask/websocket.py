from app import io as socketio, db as mydb
from flask import request
from flask_socketio import join_room,leave_room
from bson import ObjectId

@socketio.on('register')
def register(username,email,password):
    mydb.insertUser(username,password,email,"")

@socketio.on('signedIn')
def signIn(userId):
    print(f"Entered signed in with id {userId}")
    SID= request.sid
    mydb.updateSID(userId["token"],SID)
    rooms=mydb.retrieveAll({"members":userId["token"]})
    for room in rooms:
        join_room(str(room["_id"]))
             
    #print("TODO")

#event handler to remove  user from a certain room 
@socketio.on('removeUser')
def removeUser(userId,roomId):
    userSID=mydb.getUserSID(userId)
    if userSID!="":
        leave_room(roomId,sid=userSID)
    mydb.removeUserfromRoom(userId,roomId)
    print(f"removing {userId} from {roomId}")

@socketio.on('createRoom')
def createRoom(roomName,userId):
    print(f"creating room with name {roomName}")
    mydb.createRoom(roomName,userId)
    


#event handler to make a certain user leave a room 
@socketio.on('leaveRoom')
def leaveRoom(userId,roomId):
    mydb.removeUserfromRoom(userId,roomId)
    leave_room(roomId)
    print(f"leaving from the room with {roomId}")


@socketio.on('disconnect')
def disconnect():
    SID=request.sid
    mydb.updateSIDUsingSID(SID)
    


@socketio.on('sendMessage')
def sendMessage(dictReq):
    print(f"sending message at {dictReq}")
    mydb.addMessageToRoom(ObjectId(dictReq["room"]),dictReq["username"],dictReq["content"])
    socketio.emit('show-message',dictReq["content"],room=dictReq["room"],include_self=True)
    

@socketio.on_error_default
def error_handler(e):
    print('An error has occurred: ' + str(e))    
