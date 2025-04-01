
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Globe, Lock, User, Shield, Droplets, Zap } from 'lucide-react';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-2xl font-bold text-river-foreground">Settings</h1>
          
          <Card className="river-card">
            <CardHeader className="pb-4">
              <CardTitle>Configuration Settings</CardTitle>
              <CardDescription>
                Manage your RiverWatcher preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="display" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Display</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span className="hidden sm:inline">Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <AccountSettings />
                </TabsContent>
                
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
                
                <TabsContent value="display">
                  <DisplaySettings />
                </TabsContent>
                
                <TabsContent value="data">
                  <DataSettings />
                </TabsContent>
                
                <TabsContent value="privacy">
                  <PrivacySettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
