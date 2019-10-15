import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  constructor() { }

  ngOnInit() {
    this.client = new Client();
    /**
     * inicializamos el websocket con la ruta configurada en spring del broker
     */
    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    /**
     * Escuchar cuando nos conectamos o desconectamos
     */
    this.client.onConnect = (frame) => {
      //Las tareas de conexion
      //el objeto frame tiene toda la informacion de nuestra conexion con el broker
      console.log('Conectados: ' + this.client.connected + ' : ' + frame);
    }

    //inicializar la conexion 
    this.client.activate();
  }

}
