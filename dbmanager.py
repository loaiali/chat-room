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
    userId:SID
}
'''


import pymongo


class DBManager:
    def __init__(self, dbname, host="localhost", port=27017):
        self.client = pymongo.MongoClient(host, port)
        self.db = self.client.get_database(dbname)  
    def createRoom(self,roomName,userId):
        return self.db.my_collection.insert_one({"roomName":roomName,"members":[userId],"creator":userId,"messages":[]})    
    
    def addUserToRoom(self,roomID,userID):
        self.db.my_collection.update({'_id': roomID}, {'$addToSet': {'members': [userID]}})   
    def insertSID(self,userId,SID):
        self.db.my_collection.insert_one({"userId":userId,"SID":SID})
    def updateSID(self,userId,SID):
        self.db.my_collection.update({"userId":userId},{'$set':{'SID':SID}})   
    def addMessageToRoom(self,roomId,userId,message):
        self.db.my_collection.update({'_id': roomId}, {'$addToSet': {'messages': {"message":message,"owner":userId}}})
    def getAllMessagesOfRoom(self,roomId):
        room=self.db.my_collection.find_one({"_id":roomId})
        return room["messages"]
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
    		objects.append(item)
    	return objects  

    #key will be like
    # {"key": value}
    def deleteOne(self, key):
    	self.db.my_collection.delete_one(key)   
    #key and update will be like
    # {"key": value}
    def updateOne(self, key, update):
    	self.db.my_collection.update_one(key, { '$set':update}, upsert=True)    
    #increments a value with a specefic number
    # if update = {"x": 3}
    # then x will be incremented by 2
    def incrementOne(self, key, update):
    	self.db.my_collection.update_one(key, { '$inc':update}, upsert=True)

    def getUserSID(self,userId):
        return self.db.my_collection.find_one({"userId":userId})
    
    def removeUserfromRoom(self,userId,roomId):
        self.db.my_collection.update({'_id':roomId},{'$pull':{"members":userId}})


if __name__ == "__main__":
    dbmanager = DBManager("ChatDB")
    response=dbmanager.retrieveOne({"room1":"loai"})
    dbmanager.addUserToRoom(response["_id"],"userId5")
    dbmanager.updateSID("userId6","")
    dbmanager.addMessageToRoom(response["_id"],"userId3","Hey userId4")
    rooms=dbmanager.retrieveAll({"members":"userId4"})
    #print(dbmanager.getUserSID("userId6"))
    dbmanager.removeUserfromRoom("userId3",response["_id"])