import { Component, OnInit } from '@angular/core';
import {Router } from "@angular/router";
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements OnInit {
  public rooms = []
  constructor(private readonly router: Router, private chatService: ChatService) {
    chatService.getSubscribedRooms().subscribe((rooms) => {
      this.rooms = rooms
    })
  }

  ngOnInit() {
    
  }

  public roomClicked(room){
    this.router.navigate(["rooms", room.name]);
  }
}
