import { Inject, forwardRef } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatsService } from "src/chat/chat.service";
import { GeneralSendDto } from "src/chat/dto/general-send.dto";

@WebSocketGateway({ cors: { origin: "http://localhost:3000", credentials: true } })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService
  ) {}

  afterInit(server: Server) {
    console.log("WebSocket gateway initialized");
  }

  handleConnection(client: Socket) {
    const { userId, firstName } = client.handshake.query;

    this.server.emit("userConnected", { userId, firstName });
  }

  handleDisconnect(client: Socket) {
    const { userId, firstName } = client.handshake.query;

    this.server.emit("userDisconnected", { userId, firstName });
  }

  async handleIncomingMessage(message: GeneralSendDto) {
    this.server.emit("receiveMessage", message);
  }
}
