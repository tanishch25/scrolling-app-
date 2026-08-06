import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, Search, MoreVertical, Film, Image as ImageIcon } from 'lucide-react';
import type { Database } from '../lib/database';

type Series = Database['public']['Tables']['series']['Row'];

export default function SeriesList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeries, setNewSeries] = useState({ title: '', genre: '', description: '', cover_thumb_url: '' });

  const { data: series, isLoading } = useQuery({
    queryKey: ['admin_series'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Series[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newS: Partial<Series>) => {
      const { data, error } = await supabase.from('series').insert([newS]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_series'] });
      setIsModalOpen(false);
      setNewSeries({ title: '', genre: '', description: '', cover_thumb_url: '' });
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: newSeries.title,
      genre: newSeries.genre,
      description: newSeries.description,
      cover_thumb_url: newSeries.cover_thumb_url,
      status: 'ongoing'
    });
  };

  const filteredSeries = series?.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black tracking-tighter text-white">Series Library</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Create Series
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          type="text" 
          placeholder="Search series by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-center py-10">Loading series...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSeries?.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors group">
              <div className="h-48 bg-zinc-950 relative">
                {item.cover_thumb_url ? (
                  <img src={item.cover_thumb_url} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-800">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur rounded px-2 py-1 border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">{item.status}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">{item.genre || 'Uncategorized'}</p>
                <div className="flex justify-between items-center text-xs font-medium text-zinc-400">
                  <span className="flex items-center gap-1"><Film size={14} /> {item.total_episodes || 0} Episodes</span>
                  <button className="text-zinc-500 hover:text-white"><MoreVertical size={16} /></button>
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
              <h2 className="text-xl font-bold text-white">Create New Series</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Title</label>
                <input required type="text" value={newSeries.title} onChange={e => setNewSeries({...newSeries, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Genre</label>
                <input type="text" value={newSeries.genre} onChange={e => setNewSeries({...newSeries, genre: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Thumbnail URL</label>
                <input type="url" value={newSeries.cover_thumb_url} onChange={e => setNewSeries({...newSeries, cover_thumb_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                <textarea rows={3} value={newSeries.description} onChange={e => setNewSeries({...newSeries, description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
