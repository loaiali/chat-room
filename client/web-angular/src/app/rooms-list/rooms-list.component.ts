import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements OnInit {
  public rooms = []
  _inputRoomName: String

  constructor(private readonly router: Router, private chatService: ChatService, private authService: AuthService) {
    this.chatService.getSubscribedRooms().subscribe((rooms) => {
      this.rooms = rooms
    })
  }

  ngOnInit() {
    console.log("rooms-list on init")
    this.chatService
      .recNewUserJoined()
      .subscribe((data) => {
        this.rooms.forEach((room) => {
          if (data["roomId"] === room._id) {
            room.members.push(data["userId"])
          }
        })
      });

    this.chatService
      .recNewRoom()
      .subscribe((data) => {
        this.rooms.push(data)
      });

    this.chatService
      .recUserHasRemoved()
      .subscribe((data) => {
        if (data["userId"] === this.authService.getCurrUser().name){
          console.log("tmm ya donya !!")
          this.rooms = this.rooms.filter((room) => room._id !== data.roomId)
          this.router.navigate(["rooms"])
          return
        }
        const room = this.rooms.find((room) => room._id === data.roomId)
        room.members.pop()
      });
  }

  public roomClicked(room) {
    console.log("room clicked", room['_id'])
    this.router.navigate(["rooms", room['_id']]);
  }

  public _createNewRoomClicked() {
    this.chatService.createNewRoom(this._inputRoomName).subscribe((newRoom) => {
      this.rooms.push(newRoom)
    })
  }
}
