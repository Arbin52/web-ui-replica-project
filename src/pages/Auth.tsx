
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MFASetup from '@/components/auth/MFASetup';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
      setShowMFASetup(true);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (values: { email: string; password: string; fullName: string }) => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signUp(values.email, values.password, values.fullName);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary rounded-full">
              <Wifi size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Network Monitor</h1>
          <p className="text-gray-500 mt-1">Secure access to your network monitoring dashboard</p>
        </div>

        <Card>
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm
                onSubmit={handleLogin}
                isSubmitting={isSubmitting}
                authError={authError}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm
                onSubmit={handleSignup}
                isSubmitting={isSubmitting}
                authError={authError}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <MFASetup 
        isOpen={showMFASetup} 
        onClose={() => setShowMFASetup(false)} 
      />
    </div>
  );
};

export default Auth;
