import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { LoginComponent } from './login/login.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { SignupComponent } from './signup/signup.component';
import { ChatBodyComponent } from './chat-body/chat-body.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent,
    ChatMessageComponent,
    RoomsListComponent,
    LoginComponent,
    ChatMainComponent,
    SignupComponent,
    ChatBodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
