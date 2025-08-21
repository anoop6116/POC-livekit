import { Injectable } from '@nestjs/common';
import {
  AccessToken,
  AgentDispatchClient,
  RoomServiceClient,
} from 'livekit-server-sdk';
import { metadata } from 'reflect-metadata/no-conflict';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getAccessToken(roomName: string, participantName: string) {
    const at = new AccessToken('devkey', 'secret', {
      identity: participantName,
    });
    at.addGrant({ roomJoin: true, room: roomName });
    const token = await at.toJwt();
    console.log('access token', token);
    return token;
  }
  async createRoom(livekitHost: string, roomName: string) {
    console.log(roomName);
    const opts = {
      name: roomName,
      emptyTimeout: 10 * 60, // 10 minutes
      maxParticipants: 20,
      metadata: 'hello',
    };
    const roomService = new RoomServiceClient(livekitHost, 'devkey', 'secret');
    const room = await roomService.createRoom(opts);
    console.log('Created room:', room);

    const rooms = await roomService.listRooms();
    console.log('All rooms:', rooms);
  }
  async dispatchToken(agentName: string, roomName: string) {
    const agentDispatchClient = new AgentDispatchClient(
      'http://localhost:7880',
      'devkey',
      'secret',
    );
    const dispatch = await agentDispatchClient.createDispatch(
      roomName,
      agentName,
      {
        metadata: '{"userid":"12345}',
      },
    );
    console.log('created disptch', dispatch);
    const dispatches = await agentDispatchClient.listDispatch(roomName);

    console.log(`there are ${dispatches.length} dispatches in ${roomName}`); // Check what agents are actually registered and available
    const roomService = new RoomServiceClient(
      'http://localhost:7880',
      'devkey',
      'secret',
    );
    const participants = await roomService.listParticipants(roomName);
    const agents = participants.filter((p) => (p.kind as any) === 'AGENT');

    console.log('Created dispatch:', dispatch.id);
    console.log(`Agents actually in room: ${agents.length}`);
    console.log(
      'Agent names in room:',
      agents.map((a) => a.name),
    );
  }
}
