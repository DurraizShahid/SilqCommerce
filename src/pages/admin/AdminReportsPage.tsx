import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Report {
  id: string;
  name: string;
  type: 'sales' | 'products' | 'users' | 'vendors' | 'financial';
  dateRange: string;
  generatedAt: string;
  status: 'completed' | 'generating' | 'failed';
}

const AdminReportsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [reportType, setReportType] = useState<string>('sales');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'r1',
      name: 'Sales Report - November 2023',
      type: 'sales',
      dateRange: '2023-11-01 to 2023-11-30',
      generatedAt: '2023-11-30T10:00:00Z',
      status: 'completed',
    },
    {
      id: 'r2',
      name: 'Product Performance Report',
      type: 'products',
      dateRange: 'Last 30 days',
      generatedAt: '2023-11-28T14:30:00Z',
      status: 'completed',
    },
    {
      id: 'r3',
      name: 'Vendor Earnings Report',
      type: 'financial',
      dateRange: '2023-11-01 to 2023-11-30',
      generatedAt: '2023-11-29T09:15:00Z',
      status: 'completed',
    },
  ]);

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `r-${Date.now()}`,
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${dateRange}`,
      type: reportType as any,
      dateRange: dateRange === 'custom' ? `${customDateRange.start} to ${customDateRange.end}` : dateRange,
      generatedAt: new Date().toISOString(),
      status: 'generating',
    };

    setReports([newReport, ...reports]);
    setIsDialogOpen(false);

    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === newReport.id ? { ...r, status: 'completed' } : r))
      );
      toast.success('Report generated successfully!');
    }, 2000);
  };

  const handleDownload = (report: Report) => {
    toast.success(`Downloading ${report.name}...`);
    // In real app, this would download the actual report file
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="h-5 w-5" />;
      case 'products':
        return <Package className="h-5 w-5" />;
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'vendors':
        return <Users className="h-5 w-5" />;
      case 'financial':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Reports</H1>
          <P className="text-muted-foreground">Generate and download platform reports</P>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Sales (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(1250000)}</div>
            <Muted className="text-xs">+12.5% from last month</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,523</div>
            <Muted className="text-xs">+8.2% from last month</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <Muted className="text-xs">+5 new this month</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Commission Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(187500)}</div>
            <Muted className="text-xs">15% average rate</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getReportIcon(report.type)}
                      <span className="font-medium">{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{report.type}</span>
                  </TableCell>
                  <TableCell>{report.dateRange}</TableCell>
                  <TableCell>
                    {new Date(report.generatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'generating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(report)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>Select report type and date range</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="products">Product Performance</SelectItem>
                  <SelectItem value="users">User Analytics</SelectItem>
                  <SelectItem value="vendors">Vendor Performance</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) =>
                      setCustomDateRange({ ...customDateRange, start: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) =>
                      setCustomDateRange({ ...customDateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReportsPage;

