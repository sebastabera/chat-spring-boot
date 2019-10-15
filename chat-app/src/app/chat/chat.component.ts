import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes:Mensaje[] = [];
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
      this.conectado = true;

      this.client.subscribe('/chat/mensaje', e => {
        //Se convierte el String a un objeto de tipo mensaje
        let mensaje:Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);
        this.mensajes.push(mensaje);
        console.log(mensaje);
      });

      this.client.publish({
        destination: '/app/mensaje',
        body: JSON.stringify(this.mensaje)
      });
    }

    this.mensaje.tipo = 'NUEVO_USUARIO';
    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = false;
    }
  }

  /**
   * Metodo para iniciar la conexion
   */
  conectar():void {
    this.client.activate();
  }

  /**
   * metodo para finalizar la conexion
   */
  desconectar():void {
    this.client.deactivate();
  }

  enviarMensaje():void {
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.mensaje)
    });
    this.mensaje.texto = '';
  }

}
