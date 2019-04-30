'''
database consists of two tables ex:
{	
	"roomID":room1,
	"roomName":roomName,
	"members":[{"userID1":userId,"SID":sid},"UserID2"],
	"creator":"UserID1",
	"messages":[{"owner":userId,"message":message1,"time":time}]
}
{
    userId:{"SID":SID,"Email":Email,"Password":Password}
}
'''


import pymongo
from bson import ObjectId
# from bson.json_util import dumps

def _toObjectId(string):
    if type(string) is ObjectId:
        return string
    return ObjectId(string)
class DBManager:

    def __init__(self, dbname, host="localhost", port=27017):
        self.client = pymongo.MongoClient(host, port)
        self.db = self.client.get_database(dbname)  
    def createRoom(self,roomName,userId):
        return self.db.my_collection.insert_one({"roomName":roomName,"members":[userId],"creator":userId,"messages":[]})    
        
    def addUserToRoom(self,roomID,userID):
        self.db.my_collection.update({'_id': ObjectId(roomID)}, {'$addToSet': {'members': userID}})   
    
    
    def insertUser(self,username,password,email,SID = ""):
        try:
            return self.db.my_collection.insert_one({"_id":username,"password":password,"email":email,"SID":SID}).inserted_id
        except pymongo.errors.DuplicateKeyError:
            return ""
    
    
    def updateSID(self,username,SID):
        self.db.my_collection.update({"_id":username},{'$set':{'SID':SID}})   
    
    
    def removeSID(self, SID):
        SID=self.db.my_collection.find_one({"SID":SID})
        print("SID=+++++++++++ ",SID)
        if(SID!=None):
            self.updateSID(SID["_id"],"")
    
    
    def addMessageToRoom(self,roomId,username,message):
        self.db.my_collection.update({'_id': ObjectId(roomId)},{'$push': {'messages': {**message, "owner":username}}})
    
    
    def getRoomInfo(self, roomId): # tested = true
        '''
            return the room name and the messages {"roomName": <name>, "messages": [{}, {}]}
        '''
        roomId = _toObjectId(roomId)
        room = self.db.my_collection.find_one({"_id":roomId})
        return {"messages":room["messages"],"roomName":room["roomName"]}
   
    def getRoomInfoNoMessages(self,roomId):
        '''
            return the room name, the members and the room id
        '''
        room = self.db.my_collection.find_one({"_id":ObjectId(roomId)})
        return {"roomName": room["roomName"], "members": room["members"], "_id": str(room["_id"])}
   
    #key will be like
    # {"key": value}
    def retrieveOne(self, key):
    	return self.db.my_collection.find_one(key)
    
    
    #key will be like
    # {"key": value}
    # returns a list of dictionaries
    def retrieveAll(self, key):
    	objects = []
    	for item in self.db.my_collection.find(key):
    		objects.append(str(item))
    	return objects  
    
    
    def getUserRooms(self, userId): # tested = true
        data = []
        cur = self.db.my_collection.find({"members":userId}, { "messages": 0})
        for doc in cur:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return data
            
    
    def deleteOne(self, key):
    	self.db.my_collection.delete_one(key)   
    
    def getUsersOfRoom(self,roomID):
        #users=[]
        
        #cursor =self.db.my_collection.find()
        room=self.db.my_collection.find_one({"_id":ObjectId(roomID)},{"members"})
        return room["members"]

    
    def updateOne(self, key, update):
    	self.db.my_collection.update_one(key, { '$set':update}, upsert=True)    

    
    def getUserSID(self,userId): # tested = true
        SID= self.db.my_collection.find_one({"_id":userId},{"_id":0,"SID":1})
        return SID["SID"]
    
    def removeUserfromRoom(self,userId,roomId): # tested = true
        if type(roomId) is str:
            roomId = ObjectId(roomId)
        self.db.my_collection.update({'_id':ObjectId(roomId)},{'$pull':{"members":userId}})


if __name__ == "__main__":
    dbmanager = DBManager("ChatDB")
    print(dbmanager.removeUserfromRoom("ammar4", ObjectId("5cc78bf0dae7d6ceb019043c")))