import React, { useState, useEffect, useRef } from 'react';

const WebSocketTest: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: number;
    from: string;
    content: string | object;
    timestamp: string;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    setError(null);
    
    try {
      const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
      
      if (!websocketUrl) {
        setError("VITE_WEBSOCKET_URL environment variable is not defined");
        return;
      }
      
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      
      const socket = new WebSocket(websocketUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setConnected(true);
        addMessage("System", "Connected to WebSocket server");
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addMessage("Server", data);
        } catch (err) {
          addMessage("Server", event.data);
        }
      };
      
      socket.onerror = (event) => {
        setError("WebSocket error occurred");
        console.error("WebSocket error:", event);
      };
      
      socket.onclose = () => {
        setConnected(false);
        addMessage("System", "Disconnected from WebSocket server");
      };
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
    }
  };

  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && inputMessage) {
      socketRef.current.send(JSON.stringify({
        type: "message",
        content: inputMessage,
        timestamp: new Date().toISOString()
      }));
      addMessage("You", inputMessage);
      setInputMessage('');
    }
  };

  const addMessage = (from: string, content: string | object) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      from,
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">WebSocket Connection Test</h2>
      
      <div className="mb-4 flex space-x-2">
        {!connected ? (
          <button
            onClick={connectWebSocket}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Connect
          </button>
        ) : (
          <button
            onClick={disconnectWebSocket}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex mb-2">
          <p className="font-semibold">Status:</p>
          <p className={`ml-2 ${connected ? 'text-green-600' : 'text-red-600'}`}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          WebSocket URL: {import.meta.env.VITE_WEBSOCKET_URL || 'Not defined'}
        </p>
      </div>
      
      {connected && (
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
      
      <div className="border rounded overflow-hidden">
        <div className="bg-gray-100 p-3 border-b">
          <h3 className="font-semibold">Messages</h3>
        </div>
        <div className="h-60 overflow-y-auto p-3 bg-white">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No messages yet</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="mb-2">
                <div className="flex items-center">
                  <span className="font-semibold">{msg.from}:</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-2">
                  {typeof msg.content === 'object' ? (
                    <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(msg.content, null, 2)}
                    </pre>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;