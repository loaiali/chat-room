import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatRoomComponent } from './chat-room/chat-room.component';

// const routes: Routes = []
const routes: Routes = [
  // { path: "login", component:  },
  { path: "rooms/:room", component: ChatRoomComponent},

];

// const routes: Routes = [
//   { path: "", component: AnimalsComponent },
//   { path: "animals/:animal", component: AnimalsComponent },
// ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
