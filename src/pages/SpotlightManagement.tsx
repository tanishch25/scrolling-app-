import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, ListVideo, Trash2 } from 'lucide-react';
import type { Database } from '../lib/database';

type Spotlight = Database['public']['Tables']['spotlight']['Row'];
type Series = Database['public']['Tables']['series']['Row'];

export default function SpotlightManagement() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSpotlight, setNewSpotlight] = useState({ series_id: '', video_url: '', caption: '', photos: '', is_ad: false, product_url: '', target_tags: '' });

  const { data: spotlightItems, isLoading } = useQuery({
    queryKey: ['admin_spotlight'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spotlight')
        .select(`*, series(title)`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as any[];
    }
  });

  const { data: series } = useQuery({
    queryKey: ['admin_series_basic'],
    queryFn: async () => {
      const { data, error } = await supabase.from('series').select('id, title').is('deleted_at', null);
      if (error) throw error;
      return data as Pick<Series, 'id' | 'title'>[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newS: Partial<Spotlight>) => {
      const { data, error } = await supabase.from('spotlight').insert([newS]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_spotlight'] });
      setIsModalOpen(false);
      setNewSpotlight({ series_id: '', video_url: '', caption: '', photos: '', is_ad: false, product_url: '', target_tags: '' });
    },
    onError: (error: any) => {
      console.error("DB Error:", error.message, error.details, error.hint);
      alert(`Failed to create spotlight: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('spotlight').update({ deleted_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_spotlight'] });
    },
    onError: (error: any) => {
      console.error("DB Error:", error.message, error.details, error.hint);
      alert(`Failed to delete spotlight: ${error.message}`);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up payload: Remove empty fields so the DB uses defaults or ignores missing optional columns
    const payload: Partial<Spotlight> & { is_ad?: boolean, product_url?: string | null, target_tags?: string[] | null } = {
      series_id: newSpotlight.is_ad ? undefined : newSpotlight.series_id,
      caption: newSpotlight.caption || null,
      is_ad: newSpotlight.is_ad,
      product_url: newSpotlight.is_ad ? newSpotlight.product_url : null,
      target_tags: newSpotlight.is_ad && newSpotlight.target_tags ? newSpotlight.target_tags.split(',').map(t => t.trim().toLowerCase()) : null
    };
    
    if (newSpotlight.video_url) {
      payload.video_url = newSpotlight.video_url;
    }
    
    // Only include photos if the user actually provided some, to avoid schema cache crashes
    if (newSpotlight.photos && newSpotlight.photos.trim() !== '') {
      payload.photos = newSpotlight.photos.split(',').map(p => p.trim()).filter(Boolean);
    }

    createMutation.mutate(payload as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ListVideo className="text-orange-500" size={32} />
          <h1 className="text-3xl font-black tracking-tighter text-white">Spotlight Feed</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Vertical Video
        </button>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Loading spotlight feed...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlightItems?.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-[9/16] bg-zinc-950 relative">
                {item.video_url ? (
                  <video 
                    src={item.video_url} 
                    className="w-full h-full object-cover opacity-70"
                    muted 
                    loop 
                    autoPlay
                  />
                ) : item.photos && item.photos.length > 0 ? (
                  <img src={item.photos[0]} alt="Spotlight" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">No Media</div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => {
                      if(confirm('Delete this spotlight video?')) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    className="w-8 h-8 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center backdrop-blur hover:bg-red-500/40 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-1">{item.series?.title || 'Standalone'}</p>
                <p className="text-white text-sm line-clamp-3">{item.caption}</p>
                <div className="mt-4 flex gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span>{item.views || 0} Views</span>
                  <span>{item.likes || 0} Likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Spotlight Video</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  id="is_ad" 
                  checked={newSpotlight.is_ad} 
                  onChange={e => setNewSpotlight({...newSpotlight, is_ad: e.target.checked})} 
                  className="w-4 h-4 rounded border-zinc-800 text-orange-600 focus:ring-orange-600 focus:ring-offset-zinc-900 bg-zinc-950"
                />
                <label htmlFor="is_ad" className="text-sm font-bold text-white uppercase tracking-widest">Mark as Sponsored Ad</label>
              </div>

              {!newSpotlight.is_ad ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Linked Series</label>
                  <select 
                    required
                    value={newSpotlight.series_id}
                    onChange={e => setNewSpotlight({...newSpotlight, series_id: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select a Series</option>
                    {series?.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Product URL</label>
                    <input type="url" required placeholder="https://store.example.com/product" value={newSpotlight.product_url} onChange={e => setNewSpotlight({...newSpotlight, product_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Targeting Tags (comma-separated)</label>
                    <input type="text" required placeholder="fitness, fashion, technology" value={newSpotlight.target_tags} onChange={e => setNewSpotlight({...newSpotlight, target_tags: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Video CDN URL (Vertical 9:16)</label>
                <input type="url" placeholder="https://..." value={newSpotlight.video_url} onChange={e => setNewSpotlight({...newSpotlight, video_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Photos (Comma-separated URLs)</label>
                <input type="text" placeholder="https://img1.jpg, https://img2.jpg" value={newSpotlight.photos} onChange={e => setNewSpotlight({...newSpotlight, photos: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Caption</label>
                <textarea rows={3} value={newSpotlight.caption} onChange={e => setNewSpotlight({...newSpotlight, caption: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                  {createMutation.isPending ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
