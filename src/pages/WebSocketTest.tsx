
import React from 'react';
import Header from '@/components/Header';
import WebSocketTester from '@/components/testing/WebSocketTester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Terminal, AlertCircle } from 'lucide-react';
import { copyDjangoCommands } from '@/utils/djangoShellCommands';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WebSocketTestPage: React.FC = () => {
  const handleCopyCommands = () => {
    const success = copyDjangoCommands();
    toast({
      title: success ? "Commands copied!" : "Commands logged",
      description: success 
        ? "Django shell commands copied to clipboard" 
        : "Django shell commands logged to console"
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">WebSocket Testing</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Test and debug WebSocket connections with the Django backend
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Make sure your Django backend is running on localhost:8000 with WebSocket support enabled.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <WebSocketTester />
          </div>
          
          <div className="space-y-4">
            <Card className="river-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                  Django Shell Testing
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Use these commands in Django shell to test backend-to-frontend communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleCopyCommands}
                  className="w-full flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                  Copy Shell Commands
                </Button>
                <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                  <p>1. Run Django shell:</p>
                  <code className="block bg-muted p-2 rounded text-xs overflow-x-auto font-mono">
                    python manage.py shell
                  </code>
                  <p>2. Then paste the copied commands</p>
                  <p>3. Check the WebSocket tester for incoming messages</p>
                </div>
              </CardContent>
            </Card>

            <Card className="river-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Testing Checklist</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <span>WebSocket connection status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span>Frontend → Backend messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                  <span>Backend → Frontend messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <span>Echo/ping-pong responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span>Error handling & reconnection</span>
                </div>
              </CardContent>
            </Card>

            <Card className="river-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Connection Status</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm space-y-2">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Sensor WebSocket:</div>
                  <div className="text-xs font-mono bg-muted p-1 rounded">
                    {import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/sensors/'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Maps WebSocket:</div>
                  <div className="text-xs font-mono bg-muted p-1 rounded">
                    {import.meta.env.VITE_WS_MAPS_URL || 'ws://localhost:8000/ws/maps/'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebSocketTestPage;
