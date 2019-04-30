import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit, AfterViewInit {

  container: HTMLElement; 

  @Input() message

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {      
    this.container = document.getElementById("messagesContainer");           
    this.container.scrollTop = this.container.scrollHeight;     
  } 

}
