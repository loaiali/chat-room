import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs-chat';
  currentRoom: Observable<any>
}
