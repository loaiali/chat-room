import { Component, OnInit } from '@angular/core';
import {Router } from "@angular/router";

import { AuthService } from '../auth.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css']
})
export class ChatMainComponent implements OnInit {

  constructor(private authService: AuthService, private readonly router: Router, private chatService: ChatService) { 
    if (!authService.getToken()){
      this.router.navigate(["login"]);
    }
  }

  ngOnInit() {
    if (this.authService.getToken()){
      this.chatService.sendSignedIn()
    }
  }

}
