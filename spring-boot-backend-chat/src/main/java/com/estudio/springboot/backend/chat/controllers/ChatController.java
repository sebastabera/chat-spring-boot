package com.estudio.springboot.backend.chat.controllers;

import java.util.Date;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.estudio.springboot.backend.chat.models.documents.Mensaje;

@Controller
public class ChatController {

	@MessageMapping("/mensaje")
	// la anotacion @SendTo es para enviar a los usuarios que esten suscritos al
	// nombre del evento que agregamos en los parentesis
	@SendTo("/chat/mensaje")
	public Mensaje recibeMensaje(Mensaje mensaje) {
		mensaje.setFecha(new Date().getTime());
		mensaje.setTexto("Recibido por el broker: " + mensaje.getTexto());
		return mensaje;
	}

}
