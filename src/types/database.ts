export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          coins: number
          is_premium: boolean
          role: 'user' | 'creator' | 'admin'
          joined_at: string
          last_active: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'joined_at' | 'last_active' | 'created_at' | 'updated_at' | 'deleted_at' | 'coins' | 'is_premium' | 'role'> & { coins?: number, is_premium?: boolean, role?: 'user' | 'creator' | 'admin' }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      series: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          genre: string | null
          author: string | null
          status: string
          age_rating: string
          featured: boolean
          language: string
          cover_thumb_url: string | null
          cover_medium_url: string | null
          cover_large_url: string | null
          banner_url: string | null
          total_episodes: number
          total_views: number
          engagement_score: number
          average_rating: number
          tags: string[] | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['series']['Row']>
        Update: Partial<Database['public']['Tables']['series']['Row']>
      }
      seasons: {
        Row: {
          id: string
          series_id: string
          season_number: number
          title: string | null
          description: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['seasons']['Row']>
        Update: Partial<Database['public']['Tables']['seasons']['Row']>
      }
      episodes: {
        Row: {
          id: string
          season_id: string
          episode_number: number
          title: string
          description: string | null
          thumbnail_url: string | null
          video_url: string
          duration: number | null
          views: number
          is_free: boolean
          audio_language: string
          subtitle_language: string
          status: 'draft' | 'scheduled' | 'published' | 'archived'
          publish_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['episodes']['Row']>
        Update: Partial<Database['public']['Tables']['episodes']['Row']>
      }
      spotlight: {
        Row: {
          id: string
          series_id: string
          episode_id: string | null
          video_url: string
          caption: string | null
          hashtags: string[] | null
          views: number
          engagement_score: number
          shares: number
          saves: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['spotlight']['Row']>
        Update: Partial<Database['public']['Tables']['spotlight']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'creator' | 'admin'
      publish_status: 'draft' | 'scheduled' | 'published' | 'archived'
      interaction_type: 'like' | 'save' | 'share'
    }
  }
}
