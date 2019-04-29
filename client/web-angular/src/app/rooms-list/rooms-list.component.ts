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
    this.chatService
      .recNewUserJoined()
      .subscribe((data) => {
        this.rooms.forEach((room) => {
          if (data["roomId"] === room._id) {
            room.members = [...room.members, {}]
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
        this.rooms.forEach((room, i) => {
          if (data["roomId"] === room._id) {
            if (data["UserId"] === this.authService.getCurrUser().name) { // if that is me !!, remove this room
              console.log()
              // this.rooms[i] = null
              delete this.rooms[i]
              this.router.navigate(["rooms"]);
              return
            }
            room.members.pop()
            // room.members.forEach((member, i) => {
            //   if (data["UserId"] === member) {
            //     // room.members[i] = null
            //     room.members.pop()
            //   }
            // })
          }
        })
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
