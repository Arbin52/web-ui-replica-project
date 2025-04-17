
import React, { memo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { delayedNavigation, preventRapidExecution } from '@/utils/performance';
import { useNavigate } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
  buttonText?: string;
}

const OptimizedFeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  path,
  children,
  buttonText = "View Details"
}) => {
  const navigate = useNavigate();
  
  // Use both delayed navigation and prevent rapid execution
  const handleCardClick = useCallback(preventRapidExecution(() => {
    delayedNavigation(() => navigate(path), 50);
  }, 300), [navigate, path]);
  
  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double navigation from card click
    delayedNavigation(() => navigate(path), 50);
  }, [navigate, path]);
  
  return (
    <Card 
      className="hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(OptimizedFeatureCard);
