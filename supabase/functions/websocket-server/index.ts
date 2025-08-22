import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface WebSocketMessage {
  type: string;
  content: string;
  timestamp: string;
}

// Store active connections
const connections = new Set<WebSocket>()

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Check if this is a WebSocket upgrade request
  const upgrade = req.headers.get("upgrade") || ""
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("Expected websocket", { status: 400 })
  }

  try {
    // Upgrade the connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req)
    
    // Add to active connections
    connections.add(socket)

    // Send welcome message
    const welcomeMessage: WebSocketMessage = {
      type: "system",
      content: "Welcome to the WebSocket test server! You can send messages and they will be echoed back.",
      timestamp: new Date().toISOString()
    }
    socket.send(JSON.stringify(welcomeMessage))

    // Handle incoming messages
    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        
        // Echo the message back with server timestamp
        const echoMessage: WebSocketMessage = {
          type: "echo",
          content: `Server received: ${message.content}`,
          timestamp: new Date().toISOString()
        }
        
        socket.send(JSON.stringify(echoMessage))
        
        // Broadcast to all other connections
        connections.forEach(conn => {
          if (conn !== socket && conn.readyState === WebSocket.OPEN) {
            const broadcastMessage: WebSocketMessage = {
              type: "broadcast",
              content: `User message: ${message.content}`,
              timestamp: new Date().toISOString()
            }
            conn.send(JSON.stringify(broadcastMessage))
          }
        })
        
      } catch (error) {
        // Send error message for invalid JSON
        const errorMessage: WebSocketMessage = {
          type: "error",
          content: `Invalid JSON: ${error.message}`,
          timestamp: new Date().toISOString()
        }
        socket.send(JSON.stringify(errorMessage))
      }
    }

    // Handle connection close
    socket.onclose = () => {
      connections.delete(socket)
      console.log("WebSocket connection closed")
    }

    // Handle connection errors
    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      connections.delete(socket)
    }

    return response

  } catch (error) {
    return new Response(`WebSocket upgrade failed: ${error.message}`, { status: 500 })
  }
})