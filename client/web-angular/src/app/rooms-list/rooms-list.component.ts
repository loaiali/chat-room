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
  _inputRoomName: String

  constructor(private readonly router: Router, private chatService: ChatService) {
    this.chatService.getSubscribedRooms().subscribe((rooms) => {
      this.rooms = rooms
    })
  }

  ngOnInit() {
    
  }

  public roomClicked(room){
    console.log("room clicked", room['_id'])
    this.router.navigate(["rooms", room['_id']]);
  }

  public _createNewRoomClicked(){
    this.chatService.createNewRoom(this._inputRoomName).subscribe((newRoom) => {
      this.rooms.push(newRoom)
    })
  }
}
