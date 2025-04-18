
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'text-red-500 bg-red-50 border-red-200';
    case 'medium':
      return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'low':
      return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'network':
      return 'Wifi';
    case 'system':
      return 'Server';
    case 'access':
      return 'Lock';
    case 'configuration':
      return 'Settings';
    default:
      return 'Shield';
  }
};
