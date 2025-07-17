
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash, Upload, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const AddDevice: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    deviceType: '',
    pollInterval: '60',
    telemetryEnabled: true,
    alertsEnabled: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.deviceId || !formData.name || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Device Added Successfully',
        description: `Device ${formData.deviceId} has been registered.`,
      });
      
      navigate('/devices');
    } catch (err) {
      setError('Failed to add device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/devices');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/devices">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Add New Device</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="river-card">
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
              <CardDescription>Basic information about the device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID*</Label>
                <Input
                  id="deviceId"
                  name="deviceId"
                  placeholder="e.g., RW-001"
                  value={formData.deviceId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Device Name*</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Thames Monitoring Station"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the device and its purpose"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                  value={formData.deviceType}
                  onValueChange={(value) => handleSelectChange('deviceType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Monitor</SelectItem>
                    <SelectItem value="advanced">Advanced Monitor</SelectItem>
                    <SelectItem value="compact">Compact Monitor</SelectItem>
                    <SelectItem value="research">Research Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="river-card">
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Where the device will be deployed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name*</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., River Thames, London Bridge"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    placeholder="e.g., 51.5074"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    placeholder="e.g., -0.1278"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" type="button" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" /> Select on Map
                </Button>
              </div>
              
              <div className="bg-secondary/50 rounded-md p-4 text-sm text-muted-foreground">
                <p>You can either enter coordinates manually or click "Select on Map" to choose a location interactively.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="river-card">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Device settings and data collection parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pollInterval">Data Collection Interval (seconds)</Label>
                <Input
                  id="pollInterval"
                  name="pollInterval"
                  type="number"
                  min="10"
                  max="3600"
                  value={formData.pollInterval}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">How frequently the device will collect and transmit data</p>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="telemetryEnabled">Enable Telemetry</Label>
                  <p className="text-xs text-muted-foreground">Allow device to send measurement data</p>
                </div>
                <Switch
                  id="telemetryEnabled"
                  checked={formData.telemetryEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('telemetryEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="alertsEnabled">Enable Alerts</Label>
                  <p className="text-xs text-muted-foreground">Send notifications when readings exceed thresholds</p>
                </div>
                <Switch
                  id="alertsEnabled"
                  checked={formData.alertsEnabled}
                  onCheckedChange={(checked) => handleSwitchChange('alertsEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="river-card">
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
              <CardDescription>Additional configuration and setup options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4 mr-2" /> Import Configuration
                </Button>
                
                <div className="space-y-2">
                  <Label>Pre-configured Templates</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard River Monitor</SelectItem>
                      <SelectItem value="lake">Lake/Reservoir Monitor</SelectItem>
                      <SelectItem value="coastal">Coastal Water Monitor</SelectItem>
                      <SelectItem value="groundwater">Groundwater Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Templates provide pre-configured settings for different deployment scenarios
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" type="button" onClick={handleCancel}>
            <Trash className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>Loading...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Register Device
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;
