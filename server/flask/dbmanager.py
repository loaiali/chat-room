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
        if(SID!=None):
            self.updateSID(SID["username"],"")
    
    
    def addMessageToRoom(self,roomId,username,message):
        self.db.my_collection.update({'_id': ObjectId(roomId)},{'$push': {'messages': {**message, "owner":username}}})
    
    
    def getAllMessagesOfRoom(self,roomId):
        room = self.db.my_collection.find_one({"_id":ObjectId(roomId)})
        return {"messages":room["messages"],"roomName":room["roomName"]}
    
    
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
    
    
    def getAllRoomsOfUser(self,userId):
        data = []
        cur = self.db.my_collection.find({"members":userId})
        for doc in cur:
            doc["_id"] = str(doc["_id"])
            data.append(doc)
        return data
            
    
    #key will be like
    # {"key": value}
    def deleteOne(self, key):
    	self.db.my_collection.delete_one(key)   
    
    
    #key and update will be like
    # {"key": value}
    
    
    def updateOne(self, key, update):
    	self.db.my_collection.update_one(key, { '$set':update}, upsert=True)    

    
    def getUserSID(self,userId):
        return self.db.my_collection.find_one({"userId":userId})
    
    
    def removeUserfromRoom(self,userId,roomId):
        self.db.my_collection.update({'_id':roomId},{'$pull':{"members":userId}})


if __name__ == "__main__":
    dbmanager = DBManager("ChatDB")
    response=dbmanager.retrieveOne({"roomName":"room2"})
    dbmanager.addUserToRoom(response["_id"],"userId7")
    #dbmanager.insertUser("loaiAli2","HelloWorld","imfunky505@ymail.com","")
    #dbmanager.updateSID("loaiAli2","hello2")
    dbmanager.updateSIDUsingSID("hello2")
    print(dbmanager.getAllMessagesOfRoom(ObjectId("5cc39717f7df3645f8b65cc4")))
    #dbmanager.updateSID("userId6","")
    #dbmanager.addMessageToRoom(response["_id"],"userId3","Hey userId4")
    #rooms=dbmanager.retrieveAll({"members":"userId4"})
    #print(dbmanager.getUserSID("userId6"))
    #dbmanager.removeUserfromRoom("userId3",response["_id"])
    #dbmanager.insertSID("loaiAli","")
    #dbmanager.createRoom("room2","loaiAli")
    #print(type(response["_id"]))
    #dbmanager.addMessageToRoom(ObjectId("5cc39717f7df3645f8b65cc4"),"loaiAli2","eshm3na ba2a3")
    #print(dbmanager.getAllRoomsOfUser("loaiAli"))
    #print(dbmanager.retrieveAll({"members":"loaiAli"}))
    #print(dbmanager.updateSIDUsingSID("aa95ddb6692d469d8743c7304196c899"))