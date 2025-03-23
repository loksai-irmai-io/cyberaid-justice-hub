
import React from 'react';
import { Report } from '@/types';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import Button from './Button';
import { Download, Database } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onDownload: () => void;
  onStoreInBlockchain: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onDownload, 
  onStoreInBlockchain 
}) => {
  return (
    <Card variant="glass" className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle>{report.name}</CardTitle>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {report.crime_type}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact</p>
            <p className="text-sm">{report.mobile}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-sm">{report.place}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Incident Date</p>
            <p className="text-sm">{report.incident_date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reported On</p>
            <p className="text-sm">{report.reporting_date}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
          <p className="text-sm bg-secondary/50 rounded-lg p-3">{report.description}</p>
        </div>
        
        {report.extracted_text && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Extracted Evidence</p>
            <p className="text-sm bg-secondary/50 rounded-lg p-3">{report.extracted_text}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
          icon={<Download size={14} />}
        >
          Download PDF
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={onStoreInBlockchain}
          icon={<Database size={14} />}
        >
          Store in Blockchain
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
