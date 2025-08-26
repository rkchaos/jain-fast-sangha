import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { VratRecord, VratType, VratStatus } from '@/types/database';

export const useVratRecords = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<VratRecord | null>(null);
  const [streak, setStreak] = useState(0);

  const fetchTodayRecord = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('vrat_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today record:', error);
        return;
      }

      setTodayRecord(data);
    } catch (error) {
      console.error('Error fetching today record:', error);
    }
  };

  const calculateStreak = async () => {
    if (!user) return;

    try {
      // Get recent records in descending order
      const { data, error } = await supabase
        .from('vrat_records')
        .select('date, status')
        .eq('user_id', user.id)
        .eq('status', 'success')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error calculating streak:', error);
        return;
      }

      if (!data || data.length === 0) {
        setStreak(0);
        return;
      }

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      
      for (const record of data) {
        const recordDate = new Date(record.date);
        const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === currentStreak) {
          currentStreak++;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
  };

  const createVratRecord = async (
    type: VratType,
    status: VratStatus,
    note?: string,
    date?: string,
    isRetrospective: boolean = false
  ) => {
    if (!user) return null;

    setLoading(true);
    try {
      const recordDate = date || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('vrat_records')
        .insert({
          user_id: user.id,
          date: recordDate,
          vrat_type: type,
          status,
          note,
          is_retrospective: isRetrospective
        })
        .select()
        .single();

      if (error) throw error;

      // Also add to calendar table
      if (data) {
        await supabase
          .from('calendar')
          .insert({
            user_id: user.id,
            date: recordDate,
            vrat_id: data.id
          });

        // Refresh today's record if it's today
        if (recordDate === new Date().toISOString().split('T')[0]) {
          setTodayRecord(data);
        }
        
        // Recalculate streak
        await calculateStreak();
      }

      return data;
    } catch (error) {
      console.error('Error creating vrat record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateVratRecord = async (id: string, status: VratStatus, note?: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vrat_records')
        .update({ status, note })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setTodayRecord(data);
      await calculateStreak();
      
      return data;
    } catch (error) {
      console.error('Error updating vrat record:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodayRecord();
      calculateStreak();
    }
  }, [user]);

  return {
    loading,
    todayRecord,
    streak,
    createVratRecord,
    updateVratRecord,
    refreshData: () => {
      fetchTodayRecord();
      calculateStreak();
    }
  };
};