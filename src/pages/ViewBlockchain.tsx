
import React, { useState, useEffect } from 'react';
import BlockchainBlock from '@/components/BlockchainBlock';
import { Block } from '@/types';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import Button from '@/components/Button';
import { Database, Code, AlertTriangle } from 'lucide-react';

// Sample blockchain data (would be fetched from API in real app)
const sampleBlockchain: Block[] = [
  {
    index: 0,
    timestamp: '2023-01-01T00:00:00.000Z',
    previous_hash: '0',
    data: { message: 'Genesis Block' },
    hash: '8a708260855bfe8f3a70f48e1b1d4dbb9c711fa871001a61e6db35bea77c11e5'
  },
  {
    index: 1,
    timestamp: '2023-06-17T14:32:15.000Z',
    previous_hash: '8a708260855bfe8f3a70f48e1b1d4dbb9c711fa871001a61e6db35bea77c11e5',
    data: {
      name: 'John Doe',
      mobile: '+1 (555) 123-4567',
      place: 'New York, NY',
      incident_date: '2023-06-15',
      reporting_date: '2023-06-17',
      description: 'I received a suspicious email claiming to be from my bank...',
      crime_type: 'Phishing'
    },
    hash: '2e9af4ca67c7f12a636d1e7fbcf4ef1d3c2c7820e59ad810503ac70b9a8cd6a7'
  },
  {
    index: 2,
    timestamp: '2023-07-03T09:45:28.000Z',
    previous_hash: '2e9af4ca67c7f12a636d1e7fbcf4ef1d3c2c7820e59ad810503ac70b9a8cd6a7',
    data: {
      name: 'Jane Smith',
      mobile: '+1 (555) 987-6543',
      place: 'San Francisco, CA',
      incident_date: '2023-07-02',
      reporting_date: '2023-07-03',
      description: 'My computer was locked with a message demanding payment in Bitcoin...',
      crime_type: 'Ransomware'
    },
    hash: '5a1d7a7d4b3f7e8a9c6d5f2e1d0b8a7c6d5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d'
  }
];

const ViewBlockchain = () => {
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'blocks' | 'json'>('blocks');

  // Load blockchain
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBlockchain(sampleBlockchain);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Blockchain Explorer</CardTitle>
              <CardDescription>
                View the immutable record of all reports stored on the blockchain
              </CardDescription>
            </div>
            <div className="flex items-center bg-muted/30 rounded-lg p-1">
              <Button
                variant={viewMode === 'blocks' ? 'primary' : 'ghost'}
                size="sm"
                className="rounded-lg"
                onClick={() => setViewMode('blocks')}
              >
                <Database className="h-4 w-4 mr-2" />
                Blocks
              </Button>
              <Button
                variant={viewMode === 'json' ? 'primary' : 'ghost'}
                size="sm"
                className="rounded-lg"
                onClick={() => setViewMode('json')}
              >
                <Code className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted/20 rounded-xl animate-pulse-slow"></div>
              ))}
            </div>
          ) : blockchain.length > 0 ? (
            viewMode === 'blocks' ? (
              <div className="space-y-6">
                {blockchain.map((block, index) => (
                  <BlockchainBlock key={block.hash} block={block} animationDelay={index} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/10 rounded-lg p-4 border border-border overflow-x-auto">
                <pre className="text-xs font-mono">
                  {JSON.stringify(blockchain, null, 2)}
                </pre>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No blockchain data</h3>
              <p className="text-muted-foreground mt-1">
                No blocks have been created yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewBlockchain;
