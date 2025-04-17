
import React, { memo, useCallback, useState } from 'react';
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
  priority?: 'low' | 'medium' | 'high';
}

const OptimizedFeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  path,
  children,
  buttonText = "View Details",
  priority = 'medium'
}) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // Determine delay based on priority
  const getNavigationDelay = () => {
    switch (priority) {
      case 'low': return 150;
      case 'medium': return 100;
      case 'high': return 50;
      default: return 100;
    }
  };
  
  // Calculate cooldown time based on priority
  const getCooldownTime = () => {
    switch (priority) {
      case 'low': return 500;
      case 'medium': return 400;
      case 'high': return 300;
      default: return 400;
    }
  };
  
  // Use both delayed navigation and prevent rapid execution
  const handleCardClick = useCallback(preventRapidExecution(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    
    // Add visual feedback before navigation
    delayedNavigation(() => {
      navigate(path);
      // Reset status after navigation (important for back navigation)
      setTimeout(() => setIsNavigating(false), 500);
    }, getNavigationDelay());
  }, getCooldownTime()), [navigate, path, isNavigating]);
  
  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double navigation from card click
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    delayedNavigation(() => {
      navigate(path);
      // Reset status after navigation
      setTimeout(() => setIsNavigating(false), 500);
    }, getNavigationDelay());
  }, [navigate, path, isNavigating, getNavigationDelay]);
  
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${isNavigating ? 'pointer-events-none opacity-90' : ''}`} 
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
          disabled={isNavigating}
        >
          {isNavigating ? 'Loading...' : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(OptimizedFeatureCard);
