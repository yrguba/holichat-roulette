import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { ConnectionsService } from "./connections.service";
import { logger } from "nestjs-i18n";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ConnectionsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private connectionService: ConnectionsService) {}

  @WebSocketServer() server: Server;

  private connections = [];
  private waitingConnections = [];

  @SubscribeMessage("createConnection")
  async handleCreateConnection(client: any, payload: { uuid: string }) {
    await this.connectionService.createConnection(client.id, payload.uuid);
    console.log("connect -", client.id);
    logger.log("connect -", client.id);
    //this.waitingConnections.push({ id: client.id, uuid: payload.uuid, isWaiting: true });
  }

  // @SubscribeMessage("responseAccessToConference")
  // async handleResponseAccessToConference(
  //   client: any,
  //   payload: {
  //     conferenceName: string;
  //     userName: string;
  //     userId: string;
  //     requestIsApproved: boolean;
  //   }
  // ) {
  //   const conference = await this.conferenceService.getConferenceData(
  //     payload.conferenceName
  //   );
  //   if (conference) {
  //     this.connections.forEach((client: Socket) => {
  //       this.server?.sockets?.to(client.id)?.emit("receiveAccessToConference", {
  //         conferenceName: payload.conferenceName,
  //         userName: payload.userName,
  //         userId: payload.userId,
  //         requestIsApproved: payload.requestIsApproved,
  //       });
  //     });
  //
  //     this.waitingConnections = this.waitingConnections.filter(
  //       (connection) => connection.userId === payload.userId
  //     );
  //   }
  // }
  //
  // @SubscribeMessage("getQueueRequestsAccess")
  // async getQueueRequestsAccess(
  //   client: Socket,
  //   payload: {
  //     conferenceName: string;
  //   }
  // ) {
  //   const connections = this.waitingConnections.filter(
  //     (connection) => connection.conferenceName === payload.conferenceName
  //   );
  //   this.server?.sockets
  //     ?.to(client.id)
  //     ?.emit("receiveQueueRequestsAccess", connections);
  // }

  // @SubscribeMessage("removeFromConferenceWaitingList")
  // async removeFromConferenceWaitingList(
  //   client: Socket,
  //   payload: {
  //     conferenceName: string;
  //     userId: string;
  //   }
  // ) {
  //   this.waitingConnections = this.waitingConnections.filter(
  //     (connection) =>
  //       connection.conferenceName !== payload.conferenceName &&
  //       connection.userId !== payload.userId
  //   );
  // }

  async handleConnection(client: Socket, ...args: any[]) {
    const currentConnection = this.connections.find(
      (connection) => connection.id === client.id
    );
    if (!currentConnection) {
      this.connections.push(client);
    }
  }

  handleDisconnect(client: Socket) {
    //this.waitingConnections.filter((connection) => connection.id !== client.id);
    console.log("disconnect -", client.id);
    logger.log("disconnect -", client.id);
    //await this.connectionService.deleteConnection(client.id);
  }

  afterInit(server: Server) {
    this.connectionService.socket = server;
  }
}
