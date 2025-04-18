
export interface Vulnerability {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  fixSteps: string[];
  resolved: boolean;
  category: 'network' | 'system' | 'access' | 'configuration';
  impact: string;
  detectedDate: string;
}
