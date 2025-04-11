
import React, { useState, useEffect } from 'react';
import { Activity, Download, Upload, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

const Speed: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [displayDownload, setDisplayDownload] = useState<number | null>(null);
  const [displayUpload, setDisplayUpload] = useState<number | null>(null);
  const [displayPing, setDisplayPing] = useState<number | null>(null);

  // Effect to smoothly animate displayed values
  useEffect(() => {
    if (downloadSpeed !== null) {
      const interval = setInterval(() => {
        setDisplayDownload(prev => {
          if (prev === null) return downloadSpeed;
          const diff = downloadSpeed - prev;
          if (Math.abs(diff) < 0.1) return downloadSpeed;
          return prev + (diff * 0.1);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [downloadSpeed]);

  useEffect(() => {
    if (uploadSpeed !== null) {
      const interval = setInterval(() => {
        setDisplayUpload(prev => {
          if (prev === null) return uploadSpeed;
          const diff = uploadSpeed - prev;
          if (Math.abs(diff) < 0.1) return uploadSpeed;
          return prev + (diff * 0.1);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [uploadSpeed]);

  useEffect(() => {
    if (ping !== null) {
      const interval = setInterval(() => {
        setDisplayPing(prev => {
          if (prev === null) return ping;
          const diff = ping - prev;
          if (Math.abs(diff) < 0.1) return ping;
          return prev + (diff * 0.1);
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [ping]);

  const simulateSpeedTest = () => {
    setIsLoading(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setDisplayDownload(null);
    setDisplayUpload(null);
    setDisplayPing(null);
    setProgressPercent(0);
    
    // Simulate measuring ping
    setTimeout(() => {
      const pingValue = Math.floor(Math.random() * 30) + 5; // 5-35ms
      setPing(pingValue);
      toast.info("Ping measured");
      setProgressPercent(20);
      
      // Simulate measuring download speed
      setTimeout(() => {
        const randomDownloadSpeed = (Math.random() * 100) + 50; // 50-150 Mbps
        setDownloadSpeed(parseFloat(randomDownloadSpeed.toFixed(1)));
        toast.info("Download speed measured");
        setProgressPercent(60);
        
        // Simulate measuring upload speed
        setTimeout(() => {
          const randomUploadSpeed = (Math.random() * 20) + 10; // 10-30 Mbps
          setUploadSpeed(parseFloat(randomUploadSpeed.toFixed(1)));
          toast.success("Speed test completed!");
          setProgressPercent(100);
          setIsLoading(false);
        }, 2000); // Wait 2 seconds for upload measurement
      }, 2500); // Wait 2.5 seconds for download measurement
    }, 1500); // Wait 1.5 seconds for ping measurement
  };
  
  return (
    <div className="content-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={24} />
        <h2 className="text-xl font-bold">Internet Speed Test</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center space-y-8 mb-8">
          <div className="w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center">
            <div className="text-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
              ) : displayDownload ? (
                <>
                  <div className="text-3xl font-bold text-primary mb-1">{displayDownload.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Mbps</div>
                </>
              ) : (
                <RefreshCw size={32} className="text-gray-400 mx-auto mb-2" />
              )}
            </div>
          </div>
          
          <Button 
            onClick={simulateSpeedTest} 
            disabled={isLoading}
            className="px-6 py-2"
            size="lg"
          >
            {isLoading ? 'Testing...' : 'Start Speed Test'}
          </Button>
        </div>
        
        {isLoading && (
          <div className="mb-8">
            <Progress value={progressPercent} className="h-2 mb-2" />
            <div className="text-center text-sm text-gray-500">
              {progressPercent < 30 ? 'Measuring ping...' : 
              progressPercent < 70 ? 'Measuring download speed...' : 
              'Measuring upload speed...'}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <Download size={20} />
              <h3 className="font-semibold">Download</h3>
            </div>
            <div className="text-2xl font-bold">
              {displayDownload ? `${displayDownload.toFixed(1)} Mbps` : '-'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Upload size={20} />
              <h3 className="font-semibold">Upload</h3>
            </div>
            <div className="text-2xl font-bold">
              {displayUpload ? `${displayUpload.toFixed(1)} Mbps` : '-'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2 text-purple-600">
              <Activity size={20} />
              <h3 className="font-semibold">Ping</h3>
            </div>
            <div className="text-2xl font-bold">
              {displayPing ? `${displayPing.toFixed(1)} ms` : '-'}
            </div>
          </div>
        </div>
        
        {(displayDownload || displayUpload) && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold mb-3">Speed Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Date/Time:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">ISP:</span>
                <span className="font-medium">Detected Network Provider</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Server:</span>
                <span className="font-medium">Local Server</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Connection Type:</span>
                <span className="font-medium">Wi-Fi</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                <strong>Note:</strong> This is a simulated speed test for demonstration purposes. 
                For accurate results, use a dedicated speed testing service.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Speed;
