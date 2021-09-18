import { Injectable } from '@angular/core';
import { ChatMessageDto } from '../models/chatMessageDto';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  webSocket: WebSocket;
  chatMessages: ChatMessageDto[] = [];

  constructor() { }

  public openWebSocket(){
    if (!this.webSocket || this.webSocket.CLOSED) {
      this.webSocket = new WebSocket('ws://localhost:8080/chat');

      this.webSocket.onopen = (event) => {
        console.log('Open: ', event);
        clearTimeout();
      };
  
      this.webSocket.onmessage = (event) => {
        const chatMessageDto = JSON.parse(event.data);
        this.chatMessages.push(chatMessageDto);
      };
  
      this.webSocket.onerror = (event) => {
        console.log('Error: ', event);
        this.webSocket.close();
      };
  
      this.webSocket.onclose = (event) => {
        console.log('Close: ', event);
        console.log('Retry: ', event);
        this.openWebSocket();
      };
    }
  }

  public sendMessage(chatMessageDto: ChatMessageDto){
    this.webSocket.send(JSON.stringify(chatMessageDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
