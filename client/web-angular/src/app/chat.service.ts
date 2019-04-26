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

  public recOldMessages = () => {

    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {

        observer.next(message);
      });
    });
  }

  public setRoomTo(roomId: String) {
    this.currRoom = Observable.create((observer) => {
      observer.next(roomId)
    })
  }

  /**
   * return old chats of current room
   */
  public getChats() {
    return Observable.create((observer) => {
      this.http.get(`http://localhost:3000/${this.currRoom || "room1"}/chats`, {
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

  private nowStr() {
    const d = new Date()
    const time = d.getHours().toString() + ": " + d.getMinutes().toString()
    return time
  }
}
