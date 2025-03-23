
import React, { useState, useEffect } from 'react';
import BlockchainBlock from '@/components/BlockchainBlock';
import { Block } from '@/types';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import Button from '@/components/Button';
import { Database, Code, AlertTriangle } from 'lucide-react';
import { blockchainService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const ViewBlockchain = () => {
  const { toast } = useToast();
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'blocks' | 'json'>('blocks');

  // Load blockchain
  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        setIsLoading(true);
        const data = await blockchainService.getBlocks();
        setBlockchain(data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching blockchain:', error);
        setError('Failed to load blockchain data. Please try again later.');
        toast({
          title: "Error",
          description: error.message || "Failed to fetch blockchain data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlockchain();
  }, [toast]);

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
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-medium">Error Loading Blockchain</h3>
              <p className="text-muted-foreground mt-1">{error}</p>
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
