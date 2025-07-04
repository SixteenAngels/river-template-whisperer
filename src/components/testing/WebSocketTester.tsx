
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff, 
  Send, 
  Trash2, 
  Activity, 
  MessageSquare,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useWebSocketTesting, TestMessage } from '@/hooks/useWebSocketTesting';

const WebSocketTester: React.FC = () => {
  const { 
    isConnected, 
    connectionState, 
    messages, 
    error, 
    sendTestMessage, 
    sendPing, 
    clearMessages,
    reconnect
  } = useWebSocketTesting();
  
  const [testInput, setTestInput] = useState('Hello from frontend!');

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected': return 'default';
      case 'connecting': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatMessage = (message: TestMessage) => {
    return {
      ...message,
      displayTime: new Date(message.timestamp).toLocaleTimeString()
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                WebSocket Connection Tester
              </CardTitle>
              <CardDescription>
                Test bidirectional WebSocket communication with Django backend
              </CardDescription>
            </div>
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connectionState}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => sendTestMessage(testInput)} 
              disabled={!isConnected}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Test Message
            </Button>
            
            <Button 
              onClick={sendPing} 
              disabled={!isConnected}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Send Ping
            </Button>
            
            <Button 
              onClick={reconnect} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reconnect
            </Button>
            
            <Button 
              onClick={clearMessages} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Message:</label>
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter test message to send..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isConnected) {
                  sendTestMessage(testInput);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Log ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No messages yet. Send a test message to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const formatted = formatMessage(message);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatted.displayTime}
                        </span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <pre className="text-sm whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(message.data, null, 2)}
                        </pre>
                      </div>
                      {index < messages.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebSocketTester;
