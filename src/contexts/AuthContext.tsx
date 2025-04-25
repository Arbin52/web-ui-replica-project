
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to send login notification
  const sendLoginNotification = async (email: string) => {
    try {
      console.log("Sending login notification to:", email);
      const { error } = await supabase.functions.invoke('login-notification', {
        body: { email },
      });
      
      if (error) {
        console.error("Error sending login notification:", error);
      } else {
        console.log("Login notification sent successfully");
      }
    } catch (error) {
      console.error("Failed to send login notification:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user?.email) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          
          // Send login notification email
          setTimeout(() => {
            sendLoginNotification(session.user.email!);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have successfully signed out.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Signing up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          // Remove emailRedirectTo to prevent email confirmation requirement
        }
      });

      if (error) throw error;
      
      if (data.user) {
        // Automatically sign in after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        toast({
          title: "Account created",
          description: "Your account has been created and you're now signed in.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in instead.";
      }
      
      toast({
        title: "Error",
        description: errorMessage || "Failed to sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        
        // Handle specific error cases
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email to confirm your account before signing in.",
            variant: "destructive",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to sign in",
            variant: "destructive",
          });
        }
        
        throw error;
      }

      // If we got here, sign-in was successful
      console.log("Sign in successful:", data.user?.email);
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
