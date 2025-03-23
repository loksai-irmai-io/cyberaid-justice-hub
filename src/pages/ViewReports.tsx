
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReportCard from '@/components/ReportCard';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import { reportService } from '@/services/api';

const ViewReports = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use React Query to fetch reports
  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getReports,
    onSuccess: (data) => {
      console.log('Reports fetched successfully:', data.length, 'reports');
    },
    onError: (err: Error) => {
      console.error('Error fetching reports:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch reports",
        variant: "destructive",
      });
    },
  });

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.crime_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (report: Report) => {
    try {
      if (!report.id) {
        throw new Error("Report ID is missing");
      }
      
      const pdfBlob = await reportService.downloadReportPdf(report.id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `incident_report_${report.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: `PDF report for ${report.name} has been downloaded.`,
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleStoreInBlockchain = async (report: Report) => {
    try {
      if (!report.id) {
        throw new Error("Report ID is missing");
      }
      
      const response = await reportService.storeInBlockchain(report.id);
      
      if (response.success) {
        toast({
          title: "Success",
          description: `Report for ${report.name} has been stored in the blockchain.`,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Error storing in blockchain:', error);
      toast({
        title: "Operation failed",
        description: error.message || "Failed to store report in blockchain.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>View Submitted Reports</CardTitle>
          <CardDescription>
            Review all incident reports that have been submitted to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by name, location, type, or description..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-[400px] bg-muted/20 rounded-xl animate-pulse-slow"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-medium">Error Loading Reports</h3>
              <p className="text-muted-foreground mt-1">{(error as Error).message || 'Failed to load reports'}</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report, index) => (
                <div 
                  key={report.id || index} 
                  className="section-animation"
                  style={{ '--section-delay': index } as React.CSSProperties}
                >
                  <ReportCard
                    report={report}
                    onDownload={() => handleDownloadPDF(report)}
                    onStoreInBlockchain={() => handleStoreInBlockchain(report)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No reports found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm ? 'Try changing your search terms' : 'No reports have been submitted yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewReports;
