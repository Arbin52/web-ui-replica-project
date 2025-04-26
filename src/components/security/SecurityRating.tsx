
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface SecurityRatingProps {
  rating: number;
}

const SecurityRating: React.FC<SecurityRatingProps> = ({ rating }) => {
  const getSecurityRatingColor = (rating: number) => {
    if (rating >= 80) return "bg-green-500";
    if (rating >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Security Rating</span>
        <span className="text-sm text-muted-foreground">{rating}%</span>
      </div>
      <Progress value={rating} className={`h-2 ${getSecurityRatingColor(rating)}`} />
    </div>
  );
};

export default SecurityRating;
