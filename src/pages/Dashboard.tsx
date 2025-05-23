import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApiHealth } from '@/hooks/use-api-health';
import { useHardwareAssets } from '@/hooks/use-hardware-assets';
import { Activity, HardDrive, Package, Users, AlertTriangle } from 'lucide-react';

export function Dashboard() {
  const { data: healthData, isLoading: healthLoading, error: healthError } = useApiHealth();
  const { data: assetsData, isLoading: assetsLoading, error: assetsError } = useHardwareAssets({ limit: 5 });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to AssetPrism - IT Asset Management System
        </p>
      </div>

      {/* API Health Status */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="text-yellow-600">Checking API connectivity...</div>
            ) : healthError ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                API Offline - {healthError.message}
              </div>
            ) : healthData ? (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✅ Online
                </Badge>
                <span className="text-sm text-gray-600">
                  Version: {healthData.version} | Last check: {new Date(healthData.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetsLoading ? '...' : assetsError ? 'Error' : assetsData?.pagination?.totalItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Hardware assets in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetsLoading ? '...' : assetsError ? 'Error' : 
                assetsData?.data?.filter(asset => asset.status === 'deployed').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Assets currently in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetsLoading ? '...' : assetsError ? 'Error' : 
                assetsData?.data?.filter(asset => asset.status === 'in_stock').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Assets ready for deployment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Active users in system
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
            <CardDescription>
              Latest hardware assets added to inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assetsLoading ? (
              <div className="text-gray-500">Loading assets...</div>
            ) : assetsError ? (
              <div className="text-red-600">Failed to load assets</div>
            ) : assetsData?.data && assetsData.data.length > 0 ? (
              <div className="space-y-4">
                {assetsData.data.slice(0, 5).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{asset.model_name}</p>
                      <p className="text-sm text-gray-500">
                        {asset.manufacturer_name} • SN: {asset.serial_number}
                      </p>
                    </div>
                    <Badge variant={
                      asset.status === 'deployed' ? 'default' :
                      asset.status === 'in_stock' ? 'secondary' :
                      asset.status === 'in_repair' ? 'destructive' : 'outline'
                    }>
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No assets found</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Add New Asset</div>
              <div className="text-sm text-gray-500">Register a new hardware asset</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Asset Check-out</div>
              <div className="text-sm text-gray-500">Assign asset to user</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Generate Report</div>
              <div className="text-sm text-gray-500">Create asset inventory report</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 