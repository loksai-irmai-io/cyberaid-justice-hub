
import React, { useState, useEffect } from 'react';
import ReportCard from '@/components/ReportCard';
import { Report } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Search } from 'lucide-react';

// Sample data (would be fetched from API in a real app)
const sampleReports: Report[] = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '+1 (555) 123-4567',
    place: 'New York, NY',
    incident_date: '2023-06-15',
    reporting_date: '2023-06-17',
    description: 'I received a suspicious email claiming to be from my bank asking for my login credentials. The email contained several grammar errors and the sender address was unusual.',
    crime_type: 'Phishing',
    extracted_text: 'Dear customer, we have noticed suspicious activity on your account. Please login immediately to verify your identity...'
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '+1 (555) 987-6543',
    place: 'San Francisco, CA',
    incident_date: '2023-07-02',
    reporting_date: '2023-07-03',
    description: 'My computer was locked with a message demanding payment in Bitcoin to unlock my files. All my documents appear to be encrypted.',
    crime_type: 'Ransomware',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    mobile: '+1 (555) 456-7890',
    place: 'Chicago, IL',
    incident_date: '2023-05-28',
    reporting_date: '2023-06-01',
    description: 'I noticed unauthorized transactions on my credit card statement. Someone made several purchases at online retailers I never visited.',
    crime_type: 'Identity Theft',
  }
];

const ViewReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load reports
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setReports(sampleReports);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.crime_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (report: Report) => {
    toast({
      title: "Download initiated",
      description: `PDF report for ${report.name} is being prepared.`,
    });
  };

  const handleStoreInBlockchain = (report: Report) => {
    toast({
      title: "Success",
      description: `Report for ${report.name} has been stored in the blockchain.`,
    });
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
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report, index) => (
                <div 
                  key={report.id} 
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
