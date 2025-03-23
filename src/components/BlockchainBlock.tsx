
import React from 'react';
import { Block } from '@/types';
import Card, { CardHeader, CardTitle, CardContent } from './Card';

interface BlockchainBlockProps {
  block: Block;
  animationDelay?: number;
}

const BlockchainBlock: React.FC<BlockchainBlockProps> = ({ 
  block,
  animationDelay = 0
}) => {
  return (
    <Card 
      variant="glass" 
      className="w-full section-animation"
      style={{ '--section-delay': animationDelay } as React.CSSProperties}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Block #{block.index}</CardTitle>
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {new Date(block.timestamp).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Hash</p>
          <p className="text-xs font-mono bg-secondary/50 rounded-lg p-3 truncate">{block.hash}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Previous Hash</p>
          <p className="text-xs font-mono bg-secondary/50 rounded-lg p-3 truncate">{block.previous_hash}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Data</p>
          <pre className="text-xs font-mono bg-secondary/50 rounded-lg p-3 overflow-x-auto">
            {JSON.stringify(block.data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainBlock;
