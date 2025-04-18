
import React from 'react';
import { ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Vulnerability } from './types';
import { getSeverityColor, getCategoryIcon } from './utils';

interface UnresolvedIssuesProps {
  vulnerabilities: Vulnerability[];
  onResolve: (id: string) => void;
}

const UnresolvedIssues: React.FC<UnresolvedIssuesProps> = ({ vulnerabilities, onResolve }) => {
  return (
    <>
      <h3 className="font-medium">Unresolved Issues</h3>
      <Accordion type="single" collapsible className="w-full">
        {vulnerabilities.map((vuln) => (
          <AccordionItem key={vuln.id} value={vuln.id} className={`border rounded-md mb-2 ${getSeverityColor(vuln.severity)}`}>
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center gap-2 text-left">
                <ShieldAlert size={18} />
                <span>{vuln.title}</span>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full uppercase bg-white bg-opacity-60">
                  {vuln.severity}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0 bg-white border-t">
              <div className="space-y-3">
                <p className="text-gray-700">{vuln.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Resolution Steps:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    {vuln.fixSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="pt-2 flex justify-between items-center">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-blue-600"
                  >
                    <ExternalLink size={14} className="mr-1" />
                    Learn More
                  </Button>
                  
                  <Button
                    onClick={() => onResolve(vuln.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 size={14} className="mr-1" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default UnresolvedIssues;
