
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import Button from '@/components/Button';
import { FileText, Upload, Mic, Calendar, MapPin, Phone, User } from 'lucide-react';

const ReportIncident = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [evidenceType, setEvidenceType] = useState('Screenshot');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    place: '',
    incident_date: new Date().toISOString().split('T')[0],
    reporting_date: new Date().toISOString().split('T')[0],
    description: '',
    file: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    if (!formData.name || !formData.mobile || !formData.place || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with delay
    setTimeout(() => {
      toast({
        title: "Report submitted",
        description: "Your incident has been reported successfully.",
      });
      setIsLoading(false);
      
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        place: '',
        incident_date: new Date().toISOString().split('T')[0],
        reporting_date: new Date().toISOString().split('T')[0],
        description: '',
        file: null,
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Report an Incident</CardTitle>
          <CardDescription>
            Fill out the form below to report an incident. All information is securely stored.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span>Full Name</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>Mobile Number</span>
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="place" className="text-sm font-medium flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>Place of Incident</span>
                </label>
                <input
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                  placeholder="Enter the location of the incident"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="incident_date" className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>Date of Incident</span>
                  </label>
                  <input
                    type="date"
                    id="incident_date"
                    name="incident_date"
                    value={formData.incident_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reporting_date" className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>Reporting Date</span>
                  </label>
                  <input
                    type="date"
                    id="reporting_date"
                    name="reporting_date"
                    value={formData.reporting_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Evidence Type</span>
                <div className="flex flex-wrap gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${evidenceType === 'Screenshot' ? 'border-primary bg-primary/5 text-primary' : 'border-input'}`}>
                    <input
                      type="radio"
                      name="evidence_type"
                      value="Screenshot"
                      checked={evidenceType === 'Screenshot'}
                      onChange={() => setEvidenceType('Screenshot')}
                      className="sr-only"
                    />
                    <Upload size={18} />
                    <span>Screenshot</span>
                  </label>
                  
                  <label className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-all ${evidenceType === 'Voice' ? 'border-primary bg-primary/5 text-primary' : 'border-input'}`}>
                    <input
                      type="radio"
                      name="evidence_type"
                      value="Voice"
                      checked={evidenceType === 'Voice'}
                      onChange={() => setEvidenceType('Voice')}
                      className="sr-only"
                    />
                    <Mic size={18} />
                    <span>Voice Recording</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium">
                  Upload {evidenceType}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 border-input hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {evidenceType === 'Screenshot' ? (
                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                      ) : (
                        <Mic className="w-8 h-8 mb-3 text-muted-foreground" />
                      )}
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evidenceType === 'Screenshot' ? 'PNG, JPG or JPEG' : 'MP3 or WAV'}
                      </p>
                    </div>
                    <input
                      id="file"
                      type="file"
                      accept={evidenceType === 'Screenshot' ? "image/png, image/jpeg, image/jpg" : "audio/mpeg, audio/wav"}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {formData.file && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected file: {formData.file.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <span>Incident Description</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
                  placeholder="Describe the incident in detail..."
                ></textarea>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Submit Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIncident;
