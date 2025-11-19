import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BulkUploadPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setUploadedFile(file);
    setUploadStatus('idle');
    setErrors([]);

    // Parse CSV (simplified - in production, use a proper CSV parser)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      const data = lines.slice(1).map((line) => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index]?.trim() || '';
          return obj;
        }, {} as any);
      }).filter((row) => Object.values(row).some((v) => v));

      setPreviewData(data.slice(0, 10)); // Preview first 10 rows
      toast.success(`Loaded ${data.length} products from CSV`);
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploadStatus('processing');
    toast.info('Processing bulk upload...');

    // Simulate upload process
    setTimeout(() => {
      const hasErrors = Math.random() > 0.7; // 30% chance of errors for demo
      if (hasErrors) {
        setUploadStatus('error');
        setErrors([
          'Row 5: Invalid price format',
          'Row 12: Missing required field "name"',
          'Row 18: Invalid category',
        ]);
        toast.error('Upload completed with errors. Please review and fix.');
      } else {
        setUploadStatus('success');
        toast.success(`Successfully uploaded ${previewData.length} products!`);
      }
    }, 2000);
  };

  const downloadTemplate = () => {
    const template = `name,description,price,category,stock,imageUrl
Elegant Silk Gown,A luxurious silk gown perfect for evening events,299.99,Dresses,15,https://example.com/image1.jpg
Minimalist Trench Coat,Classic trench coat with modern design,189.50,Outerwear,10,https://example.com/image2.jpg`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Bulk Product Upload</H1>
        <P className="text-muted-foreground">Upload multiple products at once using CSV format</P>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="template">Download Template</TabsTrigger>
          <TabsTrigger value="guide">Upload Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Products</CardTitle>
              <CardDescription>
                Select a CSV file with product data. Maximum file size: 10MB
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">CSV File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {uploadedFile && previewData.length > 0 && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <P className="font-semibold">Preview ({previewData.length} rows)</P>
                      <Badge variant="outline">{previewData.length} products ready</Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(previewData[0] || {}).map((key) => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              {Object.values(row).map((value, i) => (
                                <TableCell key={i} className="max-w-[200px] truncate">
                                  {String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {errors.length > 0 && (
                    <Card className="border-destructive">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-5 w-5" />
                          Upload Errors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index} className="text-sm text-destructive">{error}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {uploadStatus === 'success' && (
                    <Card className="border-green-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <P className="font-semibold">Upload successful!</P>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleUpload} disabled={uploadStatus === 'processing'}>
                      {uploadStatus === 'processing' ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Products
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setUploadedFile(null);
                      setPreviewData([]);
                      setUploadStatus('idle');
                      setErrors([]);
                    }}>
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Download CSV Template</CardTitle>
              <CardDescription>
                Use this template to ensure your CSV file has the correct format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <P className="text-sm text-muted-foreground">
                The template includes all required fields and example data. Fill in your product
                information following the same format.
              </P>
              <Button onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              <div className="border rounded-lg p-4 bg-muted">
                <P className="font-semibold mb-2">Required Fields:</P>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>name - Product name</li>
                  <li>description - Product description</li>
                  <li>price - Product price (number)</li>
                  <li>category - Product category</li>
                  <li>stock - Stock quantity (number)</li>
                  <li>imageUrl - Product image URL</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>Upload Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <P className="font-semibold">Step 1: Prepare Your CSV File</P>
                <Muted className="text-sm">
                  Download the template and fill in your product information. Make sure all required
                  fields are filled.
                </Muted>
              </div>
              <div className="space-y-2">
                <P className="font-semibold">Step 2: Validate Your Data</P>
                <Muted className="text-sm">
                  Check that prices and stock quantities are valid numbers, and image URLs are
                  accessible.
                </Muted>
              </div>
              <div className="space-y-2">
                <P className="font-semibold">Step 3: Upload and Review</P>
                <Muted className="text-sm">
                  Upload your CSV file and review the preview. Fix any errors before finalizing the
                  upload.
                </Muted>
              </div>
              <div className="space-y-2">
                <P className="font-semibold">Step 4: Complete Upload</P>
                <Muted className="text-sm">
                  Click "Upload Products" to add all products to your catalog. Products will be
                  created in draft status for review.
                </Muted>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BulkUploadPage;

