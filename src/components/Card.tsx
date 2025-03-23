
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden shadow-sm transition-all duration-300 border animate-scale-in",
        variant === 'glass' && "glass-card",
        variant === 'outline' && "border-border bg-transparent",
        variant === 'default' && "bg-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("px-6 py-5 border-b border-border/40", className)}
      {...props}
    />
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("px-6 py-5", className)}
      {...props}
    />
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("px-6 py-4 border-t border-border/40 bg-muted/20", className)}
      {...props}
    />
  );
};

export default Card;
