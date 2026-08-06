import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

export const api = {
  // Queries
  async getTrendingSeries() {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .is('deleted_at', null)
      .order('engagement_score', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  },

  async getNewReleases() {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  },
  
  async getSpotlight() {
    const { data, error } = await supabase
      .from('spotlight')
      .select(`
        *,
        series (title, genre),
        episodes (episode_number, title)
      `)
      .is('deleted_at', null)
      .order('engagement_score', { ascending: false })
      .limit(10);
    if (error) throw error;
    // Randomize the feed
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled;
  },

  async getSeriesDetails(id: string) {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  async getSeriesEpisodes(seriesId: string) {
    // For now getting all episodes that belong to seasons of this series
    const { data, error } = await supabase
      .from('episodes')
      .select(`
        *,
        seasons!inner(series_id)
      `)
      .eq('seasons.series_id', seriesId)
      .is('deleted_at', null)
      .order('episode_number', { ascending: true });
    if (error) throw error;
    return data;
  },
  
  async getEpisodeDetails(episodeId: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', episodeId)
      .single();
    if (error) throw error;
    return data;
  }
};
