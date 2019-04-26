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
  inputMessage: String
  roomId: String
  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    // TODO: we have to get this value in observable input from the chat service or something like that
    this.roomId = "room1"
    this.messages.push({
      content: "Hi, this the default chat message",
      date: Date.now().toString(),
      username: "Application developers",
      time: this.nowStr(),
    })
  }

  onSendClicked() {
    console.log(`user typed '${this.inputMessage}' and pressed send button`)
    const fullMessage = this.chatService.sendNewMessage(this.inputMessage)
    this.messages.push(fullMessage)
  }

  ngOnInit() {
    this.chatService.getChats().subscribe((chats) => {
      chats.array.forEach(chat => {
        this.messages.push(chat)
      });
      this.messages.push(chats)
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

}
