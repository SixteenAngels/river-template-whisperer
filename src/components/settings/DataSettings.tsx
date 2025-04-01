
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Database, CloudOff, RefreshCw, Download, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const DataSettings = () => {
  const form = useForm({
    defaultValues: {
      dataRefreshRate: '5',
      offlineMode: false,
      autoSync: true,
      dataExportFormat: 'csv',
      includePH: true,
      includeTemp: true,
      includeTurbidity: true,
      includeDissolvedOxygen: true,
      includeNitrates: true,
      includePhosphates: false,
      historicalDataLimit: '30',
      advancedFiltering: false
    }
  });

  const onSubmit = (data: any) => {
    console.log('Data settings updated:', data);
    toast({
      title: "Settings saved",
      description: "Your data collection and display settings have been updated."
    });
  };

  const [isOpenAdvanced, setIsOpenAdvanced] = React.useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Collection Settings</CardTitle>
            <CardDescription>Configure how data is collected and displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dataRefreshRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Refresh Rate (minutes)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <RefreshCw className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="5" className="pl-10" type="number" min="1" max="60" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    How often to refresh data from monitoring stations (1-60 minutes)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="historicalDataLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Data Display (days)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Database className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="30" className="pl-10" type="number" min="1" max="365" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Number of days of historical data to display in charts (1-365 days)
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="offlineMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <CloudOff className="h-4 w-4" />
                      Offline Mode
                    </FormLabel>
                    <FormDescription>
                      Work with cached data when internet connection is unavailable
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
              name="autoSync"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Auto-Sync When Online
                    </FormLabel>
                    <FormDescription>
                      Automatically sync offline changes when connection is restored
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
              name="dataExportFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Data Export Format
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Default format for exporting water quality data
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monitored Parameters</CardTitle>
            <CardDescription>Select which water quality parameters to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="includePH"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>pH Level</FormLabel>
                      <FormDescription>
                        Measure of water acidity/alkalinity
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeTemp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Temperature</FormLabel>
                      <FormDescription>
                        Water temperature in celsius
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeTurbidity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Turbidity</FormLabel>
                      <FormDescription>
                        Water clarity measurement
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeDissolvedOxygen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Dissolved Oxygen</FormLabel>
                      <FormDescription>
                        Amount of oxygen in water
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeNitrates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Nitrates</FormLabel>
                      <FormDescription>
                        Nitrogen compound levels
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includePhosphates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Phosphates</FormLabel>
                      <FormDescription>
                        Phosphorus compound levels
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <Collapsible open={isOpenAdvanced} onOpenChange={setIsOpenAdvanced} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" type="button" className="flex w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Data Filtering
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpenAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="advancedFiltering"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Advanced Filtering
                        </FormLabel>
                        <FormDescription>
                          Show advanced data filtering options in dashboard
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
                
                <div className="space-y-4">
                  <Label>Custom Alert Thresholds</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ph-min" className="text-xs text-muted-foreground">pH Min</Label>
                      <Input id="ph-min" placeholder="6.5" type="number" step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="ph-max" className="text-xs text-muted-foreground">pH Max</Label>
                      <Input id="ph-max" placeholder="8.5" type="number" step="0.1" />
                    </div>
                    <div>
                      <Label htmlFor="temp-min" className="text-xs text-muted-foreground">Temp Min (°C)</Label>
                      <Input id="temp-min" placeholder="10" type="number" />
                    </div>
                    <div>
                      <Label htmlFor="temp-max" className="text-xs text-muted-foreground">Temp Max (°C)</Label>
                      <Input id="temp-max" placeholder="25" type="number" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-end">
          <Button type="submit">Save Data Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default DataSettings;
