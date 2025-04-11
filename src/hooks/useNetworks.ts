
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export type Network = {
  id: string;
  name: string;
  ssid: string | null;
  gateway_ip: string | null;
  created_at: string;
  updated_at: string;
};

export const useNetworks = () => {
  const { user } = useAuth();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNetworks();
    }
  }, [user]);

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setNetworks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch networks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addNetwork = async (network: Omit<Network, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .insert({ 
          ...network, 
          user_id: user?.id 
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setNetworks(prev => [data, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Network added successfully',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add network',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateNetwork = async (id: string, network: Partial<Omit<Network, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .update(network)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setNetworks(prev => prev.map(n => n.id === id ? data : n));
      
      toast({
        title: 'Success',
        description: 'Network updated successfully',
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update network',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteNetwork = async (id: string) => {
    try {
      const { error } = await supabase
        .from('networks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNetworks(prev => prev.filter(n => n.id !== id));
      
      toast({
        title: 'Success',
        description: 'Network deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete network',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    networks,
    loading,
    fetchNetworks,
    addNetwork,
    updateNetwork,
    deleteNetwork,
  };
};
