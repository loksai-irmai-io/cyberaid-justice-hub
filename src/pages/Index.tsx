
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Database, FileText, Search, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="space-y-10 animate-fade-in">
      <section className="pt-8 pb-12 space-y-4 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
          Incident Reporting System
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to <span className="text-primary">CyberAID</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          A secure platform for reporting incidents and ensuring justice.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link to="/report">
            <Button variant="primary" size="lg" icon={<FileText size={18} />}>
              Report an Incident
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" size="lg" icon={<Search size={18} />}>
              View Reports
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Shield className="h-8 w-8 text-primary" />}
          title="Secure Reporting"
          description="Report incidents securely with our advanced encryption and blockchain verification."
          delay={0}
        />
        <FeatureCard 
          icon={<Database className="h-8 w-8 text-primary" />}
          title="Blockchain Storage"
          description="All reports are stored on a blockchain for immutable record-keeping and verification."
          delay={1}
        />
        <FeatureCard 
          icon={<FileText className="h-8 w-8 text-primary" />}
          title="Evidence Analysis"
          description="Upload evidence such as screenshots or voice recordings for AI-powered analysis."
          delay={2}
        />
      </section>

      <section className="pt-12 pb-8">
        <Card variant="glass" className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-bold">Why CyberAID?</h3>
              <p className="text-muted-foreground">
                CyberAID uses advanced technologies including blockchain, AI, and secure databases to ensure that incident reports cannot be tampered with and are processed with the highest level of security and privacy.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Immutable record-keeping via blockchain</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>AI-powered incident classification</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <span>Encrypted evidence storage</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary/5 p-8 flex items-center justify-center">
              <div className="w-full max-w-sm p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                <div className="space-y-4 text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold">Start Reporting Today</h4>
                  <p className="text-sm text-muted-foreground">
                    Join our platform to help create a safer digital environment for everyone.
                  </p>
                  <Link to="/report" className="block">
                    <Button variant="primary" className="w-full" icon={<FileText size={16} />}>
                      Create Report
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <Card 
      className="section-animation"
      style={{ '--section-delay': delay } as React.CSSProperties}
    >
      <CardContent className="p-6 space-y-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Index;
