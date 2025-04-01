
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const form = useForm({
    defaultValues: {
      emailNotifications: true,
      appNotifications: true,
      smsNotifications: false,
      alertFrequency: 'immediate',
      warningNotifications: true,
      criticalNotifications: true,
      maintenanceNotifications: false,
      weeklyReports: true,
    }
  });

  const onSubmit = (data: any) => {
    console.log('Notification settings updated:', data);
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Channels</CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive email alerts about water quality changes
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="appNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      App Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive in-app notifications when monitoring alerts occur
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="smsNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS Notifications
                    </FormLabel>
                    <FormDescription>
                      Receive text messages for critical alerts (premium feature)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="alertFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (Real-time)</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Summary</SelectItem>
                      <SelectItem value="weekly">Weekly Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how often you want to receive alert notifications
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Types</CardTitle>
            <CardDescription>Select which types of alerts you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="warningNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-yellow-200">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-river-warning" />
                      Warning Level Alerts
                    </FormLabel>
                    <FormDescription>
                      When water quality parameters reach warning thresholds
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="criticalNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-red-200">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-river-danger" />
                      Critical Condition Alerts
                    </FormLabel>
                    <FormDescription>
                      When water quality parameters reach critical thresholds
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maintenanceNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Maintenance Notifications
                    </FormLabel>
                    <FormDescription>
                      Updates about system maintenance and downtime
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weeklyReports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Weekly Summary Reports
                    </FormLabel>
                    <FormDescription>
                      Receive weekly summary of water quality trends
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Notification Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationSettings;
