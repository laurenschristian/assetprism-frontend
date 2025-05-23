import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3,
  Download,
  FileText,
  Filter,
  PieChart,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  HardDrive
} from 'lucide-react';

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportType, setReportType] = useState('all');

  // Mock data for reports
  const reportData = {
    assetsByStatus: [
      { status: 'Deployed', count: 45, percentage: 60 },
      { status: 'In Stock', count: 20, percentage: 27 },
      { status: 'In Repair', count: 7, percentage: 9 },
      { status: 'Retired', count: 3, percentage: 4 }
    ],
    assetsByCategory: [
      { category: 'Laptops', count: 35, value: 87500 },
      { category: 'Desktops', count: 25, value: 62500 },
      { category: 'Monitors', count: 40, value: 20000 },
      { category: 'Servers', count: 5, value: 75000 }
    ],
    warrantyExpiring: [
      { asset: 'Dell Latitude 7420', serial: 'DL7420001', expires: '2024-02-15' },
      { asset: 'MacBook Pro 16"', serial: 'MBP16002', expires: '2024-02-28' },
      { asset: 'HP EliteDesk 800', serial: 'HP800003', expires: '2024-03-10' }
    ],
    recentActivity: [
      { action: 'Asset Created', item: 'Dell Latitude 7420', user: 'John Doe', date: '2024-01-25' },
      { action: 'Asset Assigned', item: 'MacBook Pro 16"', user: 'Jane Smith', date: '2024-01-24' },
      { action: 'Status Changed', item: 'HP EliteDesk 800', user: 'Bob Johnson', date: '2024-01-23' }
    ]
  };

  const availableReports = [
    {
      id: 'asset_inventory',
      title: 'Asset Inventory Report',
      description: 'Complete list of all hardware assets with current status',
      icon: HardDrive,
      category: 'Assets'
    },
    {
      id: 'asset_assignments',
      title: 'Asset Assignment Report',
      description: 'Current asset assignments by user and location',
      icon: Users,
      category: 'Assets'
    },
    {
      id: 'warranty_expiration',
      title: 'Warranty Expiration Report',
      description: 'Assets with warranties expiring in the next 90 days',
      icon: AlertTriangle,
      category: 'Maintenance'
    },
    {
      id: 'asset_utilization',
      title: 'Asset Utilization Report',
      description: 'Analysis of asset deployment and utilization rates',
      icon: TrendingUp,
      category: 'Analytics'
    },
    {
      id: 'cost_analysis',
      title: 'Cost Analysis Report',
      description: 'Asset costs, depreciation, and financial analysis',
      icon: DollarSign,
      category: 'Financial'
    },
    {
      id: 'compliance_audit',
      title: 'Compliance Audit Report',
      description: 'Asset compliance status and audit trail',
      icon: CheckCircle,
      category: 'Compliance'
    }
  ];

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In a real implementation, this would trigger report generation
  };

  const exportData = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exporting data as ${format}`);
    // In a real implementation, this would trigger data export
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate insights and reports from your asset data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => exportData('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportData('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,000</div>
            <p className="text-xs text-muted-foreground">Asset portfolio value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warranties Expiring</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployment Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <p className="text-xs text-muted-foreground">Assets in use</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 days</SelectItem>
                  <SelectItem value="last_year">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="assets">Asset Reports</SelectItem>
                  <SelectItem value="financial">Financial Reports</SelectItem>
                  <SelectItem value="compliance">Compliance Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Reports
          </CardTitle>
          <CardDescription>
            Generate detailed reports for various aspects of your asset management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <Badge variant="outline">{report.category}</Badge>
                    </div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => generateReport(report.id)}
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.assetsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <span className="text-xs text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warranty Expiration Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Warranty Expiration Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.warrantyExpiring.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.asset}</p>
                    <p className="text-xs text-gray-500">SN: {item.serial}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {new Date(item.expires).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.ceil((new Date(item.expires).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.item} • by {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 