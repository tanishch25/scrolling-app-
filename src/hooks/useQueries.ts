import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

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
