from flask import Flask, render_template,request
from flask_socketio import SocketIO,join_room,leave_room
from dbmanager import DBManager
from bson import ObjectId
app = Flask(__name__)
app.config['SECRET_KEY'] = 'loaiAli'
socketio = SocketIO(app)
mydb=DBManager("ChatDB")

@app.route('/')
def index():
    
    return render_template('login.html')
    

@app.route('/chat')
def handleMain():
    return render_template("main.html")      


@socketio.on('signedIn')
def signIn(userId):
    print(f"Entered signed in with id {userId}")
    SID=request.sid
    mydb.updateSID(userId["token"],SID)
    rooms=mydb.retrieveAll({"members":userId["token"]})
    for room in rooms:
        print("room+++++++++++++++",room)
        join_room(str(room["_id"]))
             
    #print("TODO")

@app.route('/roomchat/{roomId}')
def getAllMessages(roomId):
    
    messages=mydb.getAllMessagesOfRoom(roomId)
    return messages
    #socketio.emit('showAllMessages',messages,room=roomID)
#event handler to adding a user to a certain room 
@socketio.on('addUser')
def addUserToRoom(userID,roomID):
    mydb.addUserToRoom(roomID,userID)
    print(f"adding {userID} to the room with ID {roomID}")

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




@socketio.on('sendMessage')
def sendMessage(dictReq):
    print(f"sending message at {dictReq}")
    mydb.addMessageToRoom(ObjectId(dictReq["room"]),dictReq["username"],dictReq["content"])
    socketio.emit('show-message',dictReq["content"],room=dictReq["room"],include_self=True)
    




@socketio.on_error_default
def error_handler(e):
    print('An error has occurred: ' + str(e))    

if __name__ == '__main__':
    print(socketio)
    socketio.run(app, debug=True)       
