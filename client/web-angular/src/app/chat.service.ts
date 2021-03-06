import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { getToken } from '@angular/router/src/utils/preactivation';
import { AuthService } from './auth.service';
import { server_ip } from '../config'


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // url of the server
  // private url = 'http://localhost:53546';
  // private url = 'http://192.168.43.231:5000';
  private url = `http://${server_ip}:5000`
  private socket;
  public currUser: String;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.socket = io(this.url);
  }

  public sendSignedIn() {
    this.socket.emit("signedIn", { "token": this.currToken() })
  }

  public sendNewMessage(message, room) {
    // this.socket.emit('new-message', message);
    // const room = ["room1", "room2", "room3", "room4", "room5", "room6", "room7", "room8", "room9"][Math.floor(Math.random() * (8 - 0 + 1) + 0)]
    const fullMessage = {
      content: message,
      owner: this.authService.getCurrUser().name,
      date: Date.now(),
      token: this.currToken(),
      room: room,
      time: this.nowStr(),
    }
    this.socket.emit('sendMessage', fullMessage);
    return fullMessage
  }

  public recNewMessage = () => {
    return Observable.create((observer) => {
      this.socket.on('show-message', (message) => {
        console.log("show-message", message)
        observer.next(message);
      });
    });
  }
  public recNewUserJoined = () => {
    return Observable.create((observer) => {
      this.socket.on('userJoined', (message) => {
        console.log("new User joined this room", message)
        observer.next(message);
      });
    });
  }

  public recNewRoom = () => {
    return Observable.create((observer) => {
      this.socket.on('newRoom', (message) => {
        console.log("new room for current user", message)
        observer.next(message);
      });
    });
  }

  public recUserHasRemoved = () => {
    return Observable.create((observer) => {
      this.socket.on('userRemoved', (message) => {
        console.log("A user has removed", message)
        observer.next(message);
      });
    });
  }

  /**
   * return old chats of current room
   */
  public getChats(roomId) {
    return Observable.create((observer) => {
      this.http.get(`${this.url}/rooms/${roomId}`, {
        headers: { "x-access-token": this.currToken() },
        observe: 'response'
      }).toPromise().then(res => {
        console.log(res);
        observer.next(res.body["data"])
        observer.complete()
      }).catch(console.log);
    });
  }

  private currToken(): string {
    return this.authService.getToken().toString()
  }
  /**
   * return user subscribed rooms
   */
  public getSubscribedRooms() {
    return Observable.create((observer) => {
      this.http.get(`${this.url}/user/rooms`, {
        headers: { "x-access-token": this.currToken() },
        observe: 'response'
      }).toPromise().then(response => {
        console.log(response);
        observer.next(response.body["data"])
        observer.complete()
      }).catch(console.log);
    });
  }

  public removeUser(room, user) {
    const fullMessage = {
      token: this.currToken(),
      userId: user,
      roomId: room
    }
    this.socket.emit("removeUser", fullMessage)
    /*Observable.create((observer) => {
      // TODO: remove fake ack
      observer.next("removed")
      this.http.get(`${this.url}/${room}/del-user/${user}`, {
        params: {
          token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
        },
        observe: 'response'
      }).toPromise().then((res) => {
        observer.next(res)
      }).catch(console.log)
    })*/
  }
  public addUser(room, newUser) {
    console.log(newUser)
    const fullMessage = {
      token: this.currToken(),
      userId: newUser,
      roomId: room
    }
    this.socket.emit("addUser", fullMessage)


    /*Observable.create((observer) => {
      // TODO: remove fake ack
      observer.next("added")
      this.http.get(`${this.url}/${room}/new-user/${newUser}`, {
        params: {
          token: 'kldmflkmsdlkfmdfmdmsldkfmlsdmfsd'
        },
        observe: 'response'
      }).toPromise().then((res) => {
        observer.next(res)
      }).catch(console.log)
    })*/
  }

  public leaveRoom(room) {
    return this.removeUser(room, this.authService.getCurrUser().name)
    // console.log("leaving room",room)
    // const fullMessage={
    //   token:this.currToken(),
    //   "roomId":room
    // }
    // this.socket.emit("leaveRoom", fullMessage)
  }


  public createNewRoom(name) {
    return Observable.create((observer) => {
      this.http.post(`${this.url}/rooms`, { "name": name }, {
        headers: { "x-access-token": this.currToken() },
        observe: 'response',
      }).toPromise().then((res) => {
        console.log(res)
        observer.next({ ...res.body, members: [this.authService.getCurrUser().name,] })
        observer.complete()
      }).catch(console.log)
    })
  }
  private nowStr() {
    const d = new Date()
    const time = d.getHours().toString() + ": " + d.getMinutes().toString()
    return time
  }
}
