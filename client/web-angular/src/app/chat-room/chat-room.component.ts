import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  messages = []
  _inputMessage: String
  _inputUser: String
  roomId: String
  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    // TODO: we have to get this value in observable input from the chat service or something like that

    this.roomId = "room1"
  }

  /**
   * load the chat room after change in the room id
   */
  private load() {
    this.messages.push({
      content: "Hi, this the default chat message",
      date: Date.now().toString(),
      username: "Application developers",
      time: this.nowStr(),
    })
  }

  _onSendClicked() {
    console.log(`user typed '${this._inputMessage}' and pressed send button`)
    const fullMessage = this.chatService.sendNewMessage(this._inputMessage)
    this.messages.push(fullMessage)
    this._inputMessage = ''
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get("room")
      this.messages = []
      this.load()
    })

    this.chatService.getChats().subscribe((chats) => {
      console.log("getChats subscription recieved", chats)
      chats.forEach(chat => {
        this.messages.push(chat)
      });
    })

    this.chatService
      .recNewMessage()
      .subscribe((message) => {
        this.messages.push(message);
      });
  }

  nowStr() {
    const d = new Date()
    const time = d.getHours().toString() + ": " + d.getMinutes().toString()
    return time
  }

  _onAddUserClicked(){
    this._inputUser = ''
    this.chatService.addUser(this.roomId, this._inputUser)
  }
  
  _onRemoveUserClicked(){
    this._inputUser = ''
    this.chatService.removeUser(this.roomId, this._inputUser)
  }
  _getTitle() {
    return this.roomId
  }
}
