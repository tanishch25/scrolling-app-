import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';

export const useFeaturedSeries = () => {
  return useQuery({
    queryKey: ['featuredSeries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('featured', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAllSeries = () => {
  return useQuery({
    queryKey: ['allSeries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useTrendingSeries = () => {
  return useQuery({
    queryKey: ['series', 'trending'],
    queryFn: api.getTrendingSeries,
  });
};

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['series', 'new'],
    queryFn: api.getNewReleases,
  });
};

export const useSpotlight = () => {
  return useQuery({
    queryKey: ['spotlight'],
    queryFn: api.getSpotlight,
  });
};

export const useSeriesDetails = (id: string) => {
  return useQuery({
    queryKey: ['series', id],
    queryFn: () => api.getSeriesDetails(id),
    enabled: !!id,
  });
};

export const useSeriesEpisodes = (seriesId: string) => {
  return useQuery({
    queryKey: ['episodes', seriesId],
    queryFn: () => api.getSeriesEpisodes(seriesId),
    enabled: !!seriesId,
  });
};

export const useEpisodeDetails = (episodeId: string) => {
  return useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => api.getEpisodeDetails(episodeId),
    enabled: !!episodeId,
  });
};
