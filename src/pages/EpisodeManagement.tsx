import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, PlayCircle, Trash2, Video } from 'lucide-react';
import type { Database } from '../lib/database';

type Episode = Database['public']['Tables']['episodes']['Row'];
type Series = Database['public']['Tables']['series']['Row'];

export default function EpisodeManagement() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [newEpisode, setNewEpisode] = useState({ 
    title: '', 
    episode_number: 1, 
    video_url: '', 
    thumbnail_url: '',
    duration: 15,
    description: ''
  });

  const { data: series } = useQuery({
    queryKey: ['admin_series_basic'],
    queryFn: async () => {
      const { data, error } = await supabase.from('series').select('id, title').is('deleted_at', null);
      if (error) throw error;
      return data as Pick<Series, 'id' | 'title'>[];
    }
  });

  const { data: episodes, isLoading } = useQuery({
    queryKey: ['admin_episodes', selectedSeries],
    queryFn: async () => {
      let query = supabase
        .from('episodes')
        .select(`*`)
        .is('deleted_at', null)
        .order('episode_number', { ascending: true });
        
      if (selectedSeries) {
        // Find season ID for this series to filter episodes
        const { data: seasons, error: seasonError } = await supabase
          .from('seasons')
          .select('id')
          .eq('series_id', selectedSeries);
          
        if (seasonError) throw seasonError;
        
        if (seasons && seasons.length > 0) {
          query = query.in('season_id', seasons.map(s => s.id));
        } else {
          return [];
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Episode[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newEp: any) => {
      // First ensure a season exists for this series
      let seasonId;
      const { data: seasons, error: seasonError } = await supabase
        .from('seasons')
        .select('id')
        .eq('series_id', selectedSeries)
        .limit(1);
        
      if (seasonError) throw seasonError;
      
      if (!seasons || seasons.length === 0) {
        // Create default season 1
        const { data: newSeason, error: createSeasonError } = await supabase
          .from('seasons')
          .insert([{ series_id: selectedSeries, season_number: 1 }])
          .select();
        if (createSeasonError) throw createSeasonError;
        seasonId = newSeason[0].id;
      } else {
        seasonId = seasons[0].id;
      }

      // Insert episode
      const { data, error } = await supabase.from('episodes').insert([{
        season_id: seasonId,
        episode_number: newEp.episode_number,
        title: newEp.title,
        description: newEp.description,
        video_url: newEp.video_url,
        thumbnail_url: newEp.thumbnail_url,
        duration: newEp.duration,
        status: 'published'
      }]).select();
      
      if (error) throw error;
      
      // Update series total_episodes count manually since RPC might not exist
      const { data: currentSeries } = await supabase.from('series').select('total_episodes').eq('id', selectedSeries).single();
      const newCount = (currentSeries?.total_episodes || 0) + 1;
      await supabase.from('series').update({ total_episodes: newCount }).eq('id', selectedSeries);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_episodes'] });
      queryClient.invalidateQueries({ queryKey: ['admin_series'] });
      setIsModalOpen(false);
      setNewEpisode({ title: '', episode_number: (episodes?.length || 0) + 2, video_url: '', thumbnail_url: '', duration: 15, description: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('episodes').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_episodes'] });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeries) {
      alert("Please select a series first");
      return;
    }
    createMutation.mutate(newEpisode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PlayCircle className="text-orange-500" size={32} />
          <h1 className="text-3xl font-black tracking-tighter text-white">Episode Manager</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedSeries}
            onChange={e => setSelectedSeries(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 w-64"
          >
            <option value="">All Series</option>
            {series?.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          <button 
            onClick={() => {
              if(!selectedSeries) {
                alert("Please select a series from the dropdown first to add an episode.");
                return;
              }
              setNewEpisode(prev => ({...prev, episode_number: (episodes?.length || 0) + 1}));
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Episode
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Loading episodes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {episodes?.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-video bg-zinc-950 relative">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} className="w-full h-full object-cover opacity-80" alt={item.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <Video size={32} />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => {
                      if(confirm(`Delete Episode ${item.episode_number}: ${item.title}?`)) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center backdrop-blur hover:bg-red-500/40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur rounded px-2 py-1 border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">EP {item.episode_number}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 rounded px-1.5 py-0.5">
                  <span className="text-[10px] font-bold text-white">{item.duration}s</span>
                </div>
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-zinc-500 text-xs mb-3 line-clamp-2">{item.description || 'No description'}</p>
                
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
          {(!episodes || episodes.length === 0) && selectedSeries && (
            <div className="col-span-full text-zinc-500 text-center py-10 border border-dashed border-zinc-800 rounded-xl">
              No episodes found for this series. Click "Add Episode" to upload one.
            </div>
          )}
          {!selectedSeries && (
            <div className="col-span-full text-zinc-500 text-center py-10 border border-dashed border-zinc-800 rounded-xl">
              Please select a series from the dropdown to view its episodes.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Episode</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Ep. Number</label>
                  <input required type="number" min="1" value={newEpisode.episode_number} onChange={e => setNewEpisode({...newEpisode, episode_number: parseInt(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Title</label>
                  <input required type="text" value={newEpisode.title} onChange={e => setNewEpisode({...newEpisode, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Video URL (.mp4 CDN link)</label>
                <input required type="url" placeholder="https://..." value={newEpisode.video_url} onChange={e => setNewEpisode({...newEpisode, video_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Thumbnail URL (Optional)</label>
                <input type="url" value={newEpisode.thumbnail_url} onChange={e => setNewEpisode({...newEpisode, thumbnail_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Duration (sec)</label>
                  <input required type="number" min="1" value={newEpisode.duration} onChange={e => setNewEpisode({...newEpisode, duration: parseInt(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                  <input type="text" value={newEpisode.description} onChange={e => setNewEpisode({...newEpisode, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                  {createMutation.isPending ? 'Uploading...' : 'Save Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
