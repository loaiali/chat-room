from app import db
from bson import ObjectId


def isRoomOwner(userId, roomId):
    room = db.retrieveOne({"_id": ObjectId(roomId)})
    if not room:
        return False
    return room["creator"] == userId