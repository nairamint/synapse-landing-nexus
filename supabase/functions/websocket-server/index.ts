/**
 * WebSocket Server for SFDR Navigator Real-time Updates
 * Handles real-time communication between frontend and backend
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// In-memory store for WebSocket connections (in production, use Redis)
const connections = new Map<string, WebSocket>();

Deno.serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if this is a WebSocket upgrade request
    const upgrade = req.headers.get('upgrade');
    if (upgrade === 'websocket') {
      return handleWebSocketUpgrade(req);
    }

    // Handle regular HTTP requests for broadcasting messages
    const { message, type, userId } = await req.json();
    
    if (!message || !type) {
      return new Response(JSON.stringify({ error: 'Missing message or type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Broadcast message to all connected clients
    const broadcastMessage = {
      type,
      data: message,
      timestamp: new Date().toISOString(),
      userId
    };

    broadcastToAll(broadcastMessage);

    return new Response(JSON.stringify({ success: true, message: 'Broadcast sent' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('WebSocket server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function handleWebSocketUpgrade(req: Request): Response {
  try {
    // Create WebSocket connection
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    const connectionId = generateConnectionId();
    connections.set(connectionId, socket);

    socket.onopen = () => {
      console.log(`WebSocket connected: ${connectionId}`);
      
      // Send welcome message
      socket.send(JSON.stringify({
        type: 'connection_established',
        data: { connectionId, message: 'Connected to SFDR Navigator WebSocket' },
        timestamp: new Date().toISOString()
      }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(connectionId, message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket disconnected: ${connectionId}`);
      connections.delete(connectionId);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
      connections.delete(connectionId);
    };

    return response;
  } catch (error) {
    console.error('WebSocket upgrade failed:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}

function handleWebSocketMessage(connectionId: string, message: any) {
  console.log(`Message from ${connectionId}:`, message);

  // Handle different message types
  switch (message.type) {
    case 'subscribe':
      // Subscribe to specific update types
      handleSubscription(connectionId, message.data);
      break;
    
    case 'unsubscribe':
      // Unsubscribe from specific update types
      handleUnsubscription(connectionId, message.data);
      break;
    
    case 'ping':
      // Respond to ping with pong
      const socket = connections.get(connectionId);
      if (socket) {
        socket.send(JSON.stringify({
          type: 'pong',
          data: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString()
        }));
      }
      break;
    
    default:
      console.log(`Unknown message type: ${message.type}`);
  }
}

function handleSubscription(connectionId: string, data: any) {
  const socket = connections.get(connectionId);
  if (socket) {
    socket.send(JSON.stringify({
      type: 'subscription_confirmed',
      data: { subscribedTo: data.types },
      timestamp: new Date().toISOString()
    }));
  }
}

function handleUnsubscription(connectionId: string, data: any) {
  const socket = connections.get(connectionId);
  if (socket) {
    socket.send(JSON.stringify({
      type: 'unsubscription_confirmed',
      data: { unsubscribedFrom: data.types },
      timestamp: new Date().toISOString()
    }));
  }
}

function broadcastToAll(message: any) {
  const messageStr = JSON.stringify(message);
  let sentCount = 0;

  for (const [connectionId, socket] of connections) {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
        sentCount++;
      } else {
        // Remove closed connections
        connections.delete(connectionId);
      }
    } catch (error) {
      console.error(`Failed to send message to ${connectionId}:`, error);
      connections.delete(connectionId);
    }
  }

  console.log(`Broadcast sent to ${sentCount} connections`);
}

function generateConnectionId(): string {
  return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to send message to specific user
export function sendToUser(userId: string, message: any) {
  const messageStr = JSON.stringify({
    ...message,
    timestamp: new Date().toISOString()
  });

  let sentCount = 0;
  for (const [connectionId, socket] of connections) {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
        sentCount++;
      }
    } catch (error) {
      console.error(`Failed to send message to ${connectionId}:`, error);
    }
  }

  console.log(`Message sent to ${sentCount} connections for user ${userId}`);
}