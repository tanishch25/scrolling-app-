import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Fallback dummy data for when Supabase is not connected
const DUMMY_STORIES = [
  { id: '2', title: 'Neon Shadows', genre: 'Sci-Fi', cover_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&auto=format&fit=crop' },
  { id: '3', title: 'Vampire Elite', genre: 'Romance', cover_url: 'https://images.unsplash.com/photo-1518715303843-586e350765b2?q=80&w=400&auto=format&fit=crop' },
  { id: '4', title: 'The Last Code', genre: 'Thriller', cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop' },
  { id: '5', title: 'Dark Woods', genre: 'Horror', cover_url: 'https://images.unsplash.com/photo-1505672678657-cc70370d5e60?q=80&w=400&auto=format&fit=crop' },
  { id: '6', title: 'Galactic Empire', genre: 'Sci-Fi', cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop' },
];

const DUMMY_NEW_RELEASES = [
  { id: '7', title: 'Cyber Punk', genre: 'Action', cover_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop' },
  { id: '8', title: 'Silent Night', genre: 'Mystery', cover_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=400&auto=format&fit=crop' },
  { id: '9', title: 'Fallen Angel', genre: 'Fantasy', cover_url: 'https://images.unsplash.com/photo-1517409226500-264627dc4bbf?q=80&w=400&auto=format&fit=crop' },
  { id: '10', title: 'City of Glass', genre: 'Drama', cover_url: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=400&auto=format&fit=crop' },
];

export function useTrendingStories() {
  const [stories, setStories] = useState<any[]>(DUMMY_STORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
          throw new Error("Supabase URL not configured");
        }
        
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .limit(5);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setStories(data);
        }
      } catch (error) {
        console.warn('Falling back to dummy data for trending stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return { stories, loading };
}

export function useNewReleases() {
  const [stories, setStories] = useState<any[]>(DUMMY_NEW_RELEASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL.includes('your-supabase-url')) {
          throw new Error("Supabase URL not configured");
        }

        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setStories(data);
        }
      } catch (error) {
        console.warn('Falling back to dummy data for new releases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return { stories, loading };
}
