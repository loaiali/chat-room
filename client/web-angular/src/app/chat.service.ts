import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // url of the server
  // private url = 'http://localhost:53546';
  private url = 'http://localhost:3000';
  private socket;
  public currUser: String;
  private currRoom: Observable<any>;

  constructor(private http: HttpClient) {
    this.socket = io(this.url);
    const users = ["ammar", "abrar", "yasser"]
    const index = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    this.currUser = users[index]
    console.log(this.currUser)
    this.socket.emit("signed-in", { "token": "ammaralsayedtoken", "username": this.currUser })
  }

  public sendNewMessage(message) {
    // this.socket.emit('new-message', message);
    const room = ["room1", "room2", "room3", "room4", "room5", "room6", "room7", "room8", "room9"][Math.floor(Math.random() * (8 - 0 + 1) + 0)]
    const fullMessage = {
      content: message,
      date: Date.now(),
      username: this.currUser,
      room: room,
      time: this.nowStr(),
    }
    this.socket.emit('message', fullMessage);
    return fullMessage
  }

  public recNewMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }

  /**
   * return old chats of current room
   */
  public getChats() {
    return Observable.create((observer) => {
      // TODO: remove simulation
      setInterval(() => {
        const m = [
          {
            "content": "mes1",
            "name": "ammar",
          },
          {
            "content": "mes2",
            "name": "loai",
          },
          {
            "content": "mes3",
            "name": "samir",
          },
        ]
        // observer.next(m)
      }, 6000)
      // this.http.get(`http://localhost:3000/${this.currRoom || "room1"}/chats`, {
      //   params: {
      //     token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
      //   },
      //   observe: 'response'
      // }).toPromise().then(response => {
      //   console.log(response);
      //   observer.next(response)
      //   observer.complete()
      // }).catch(observer.error);
    });
  }

  /**
   * return user subscribed rooms
   */
  public getSubscribedRooms() {
    return Observable.create((observer) => {
      observer.next([{ name: "room1", "lastMessage": "ok, that will be great" }, { "lastMessage": "thanks", name: "room2" },])
      this.http.get(`${this.url}/${this.currUser}/rooms`, {
        params: {
          token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
        },
        observe: 'response'
      }).toPromise().then(response => {
        console.log(response);
        observer.next(response)
        observer.complete()
      }).catch(observer.error);
    });
  }

  public removeUser(room, user) {
    Observable.create((observer) => {
      // TODO: remove fake ack
      observer.next("removed")
      this.http.get(`${this.url}/${room}/del-user/${user}`, {
        params: {
          token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
        },
        observe: 'response'
      }).toPromise().then((res) => {
        observer.next(res)
      }).catch(observer.error)
    })
  }
  public addUser(room, newUser) {
    Observable.create((observer) => {
      // TODO: remove fake ack
      observer.next("added")
      this.http.get(`${this.url}/${room}/new-user/${newUser}`, {
        params: {
          token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
        },
        observe: 'response'
      }).toPromise().then((res) => {
        observer.next(res)
      }).catch(observer.error)
    })
  }

  public leaveRoom(room){
    Observable.create((observer) => {
      // TODO: remove fake ack
      this.socket.emit("leaveRoom", room)
      observer.next("leaved")
      observer.complete()
    })
  }

  private nowStr() {
    const d = new Date()
    const time = d.getHours().toString() + ": " + d.getMinutes().toString()
    return time
  }
}
