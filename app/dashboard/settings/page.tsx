'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User,
  Building2,
  Bell,
  Shield,
  Key,
  Save
} from 'lucide-react'
import { useToast } from '@/components/ui/toaster'

export default function SettingsPage() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully',
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" disabled />
            <p className="text-xs text-muted-foreground">
              Email is managed by your authentication provider
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Workspace</CardTitle>
          </div>
          <CardDescription>Manage your workspace settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceName">Workspace Name</Label>
            <Input id="workspaceName" defaultValue="My Workspace" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspaceSlug">Workspace Slug</Label>
            <Input id="workspaceSlug" defaultValue="my-workspace" />
            <p className="text-xs text-muted-foreground">
              Used in your API endpoints: api.aiplatform.com/my-workspace
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Plan</p>
              <p className="text-sm text-muted-foreground">Current subscription</p>
            </div>
            <Badge>Free</Badge>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Configuration</CardTitle>
          </div>
          <CardDescription>Default settings for your API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rateLimit">Default Rate Limit (requests/minute)</Label>
            <Input id="rateLimit" type="number" defaultValue="100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input id="webhookUrl" type="url" placeholder="https://your-app.com/webhook" />
            <p className="text-xs text-muted-foreground">
              Receive notifications for API events
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your account
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Usage Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when approaching limits
              </p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-sm text-muted-foreground">
                Manage your logged-in devices
              </p>
            </div>
            <Button variant="outline">View</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
