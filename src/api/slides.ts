import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DUMMY_SLIDES = [
  {
    id: '1',
    text_content: "The year is 2145. Neon reflects off the rain-slicked pavement. A shadow moves.",
    background_url: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '2',
    text_content: "He was supposed to be dead. But here he is, holding the encrypted drive.",
    background_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '3',
    text_content: "A drone whines overhead. Time to run. The extraction point is 2 miles away.",
    background_url: "https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=800&auto=format&fit=crop"
  }
];

export function useSeasonSlides(seasonId: string | string[]) {
  const [slides, setSlides] = useState<any[]>(DUMMY_SLIDES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
          throw new Error("Supabase URL not configured");
        }

        const sid = Array.isArray(seasonId) ? seasonId[0] : seasonId;
        
        const { data, error } = await supabase
          .from('slides')
          .select('*')
          .eq('season_id', sid)
          .order('order_index', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (error) {
        console.warn('Falling back to dummy data for slides:', error);
      } finally {
        setLoading(false);
      }
    }

    if (seasonId) {
      fetchSlides();
    }
  }, [seasonId]);

  return { slides, loading };
}
