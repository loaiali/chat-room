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
    console.log("after view init")      
    this.container = document.getElementById("mai");           
    this.container.scrollTop = this.container.scrollHeight;     
  } 

}
