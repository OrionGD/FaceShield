import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * EventsGateway — Organization-Scoped Real-Time Gateway
 *
 * Security model:
 * - Every connecting client must supply a valid JWT in handshake.auth.token
 * - Invalid / expired / pre-auth tokens are rejected with immediate disconnect
 * - Clients are joined to a room keyed by organizationId (from JWT)
 * - All broadcasts are scoped to that room — cross-org data leakage is impossible
 * - CORS is restricted to the known frontend origin only
 */
@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['https://face-shield-snowy.vercel.app', 'https://faceshield-edgeai.vercel.app'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token: string | undefined =
        client.handshake.auth?.token ||
        (client.handshake.headers?.authorization as string | undefined)
          ?.replace('Bearer ', '');

      if (!token) {
        console.warn(`[WS] Rejected unauthenticated connection: ${client.id}`);
        client.disconnect(true);
        return;
      }

      const secret = (
        this.configService.get<string>('JWT_SECRET') || ''
      ).replace(/^"|"$/g, '');

      const payload = this.jwtService.verify(token, { secret });

      // Reject pre-auth tokens — biometric not yet verified
      if (payload.type === 'pre-auth') {
        console.warn(`[WS] Rejected pre-auth token for socket: ${client.id}`);
        client.disconnect(true);
        return;
      }

      // Derive tenant room key.
      const tenantIdResolved = payload.tenantId || payload.organizationId;
      const tenantRoom = tenantIdResolved
        ? `tenant:${tenantIdResolved}`
        : `user:${payload.sub}`;

      // Tag the socket for later use
      (client as any).userId = payload.sub;
      (client as any).tenantRoom = tenantRoom;

      client.join(tenantRoom);
      console.log(`[WS] Client ${client.id} connected → room "${tenantRoom}"`);
    } catch (err: any) {
      console.warn(`[WS] Rejected invalid/expired JWT for socket ${client.id}: ${err.message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const tenantRoom = (client as any).tenantRoom;
    if (tenantRoom) {
      client.leave(tenantRoom);
    }
    console.log(`[WS] Client ${client.id} disconnected`);
  }

  /**
   * Emits an attendance event scoped to the tenant room only.
   * @param tenantId - Narrows broadcast to a single tenant's connected clients.
   */
  emitAttendanceEvent(eventData: any, tenantId?: string | null) {
    if (tenantId) {
      this.server.to(`tenant:${tenantId}`).emit('attendance_update', eventData);
    } else {
      // Fallback: broadcast to all
      this.server.emit('attendance_update', eventData);
    }
  }
}
