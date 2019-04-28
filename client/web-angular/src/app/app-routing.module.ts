import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { SignupComponent } from './signup/signup.component';

// const routes: Routes = []
const routes: Routes = [
  // { path: "login", component:  },
  { path: "login", component: LoginComponent},
  { path: "", component: LoginComponent},
  { path: "signup", component: SignupComponent},
  { path: "rooms/:room", component: ChatMainComponent},
  { path: "rooms", component: ChatMainComponent},

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
