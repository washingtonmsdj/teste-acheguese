export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cities: {
        Row: {
          created_at: string
          ibge_code: number | null
          id: number
          is_active: boolean
          name: string
          slug: string
          state_code: string
        }
        Insert: {
          created_at?: string
          ibge_code?: number | null
          id?: number
          is_active?: boolean
          name: string
          slug: string
          state_code: string
        }
        Update: {
          created_at?: string
          ibge_code?: number | null
          id?: number
          is_active?: boolean
          name?: string
          slug?: string
          state_code?: string
        }
        Relationships: []
      }
      classified_categories: {
        Row: {
          id: string
          is_active: boolean
          label: string
          sort_order: number
        }
        Insert: {
          id: string
          is_active?: boolean
          label: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      classified_conversations: {
        Row: {
          buyer_id: string
          classified_id: string
          created_at: string
          id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          classified_id: string
          created_at?: string
          id?: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          classified_id?: string
          created_at?: string
          id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_conversations_classified_id_fkey"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_favorites: {
        Row: {
          classified_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          classified_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          classified_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_favorites_classified_id_fkey"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_media: {
        Row: {
          alt: string
          classified_id: string
          created_at: string
          id: string
          position: number
          storage_key: string
        }
        Insert: {
          alt?: string
          classified_id: string
          created_at?: string
          id?: string
          position: number
          storage_key: string
        }
        Update: {
          alt?: string
          classified_id?: string
          created_at?: string
          id?: string
          position?: number
          storage_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_media_classified_id_fkey"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: number
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: number
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "classified_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_reports: {
        Row: {
          classified_id: string
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
        }
        Insert: {
          classified_id: string
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
        }
        Update: {
          classified_id?: string
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_reports_classified_id_fkey"
            columns: ["classified_id"]
            isOneToOne: false
            referencedRelation: "classifieds"
            referencedColumns: ["id"]
          },
        ]
      }
      classifieds: {
        Row: {
          category_id: string
          city_id: number
          condition: string
          created_at: string
          currency: string
          description: string
          id: string
          neighborhood: string | null
          owner_id: string
          price_cents: number | null
          published_at: string | null
          rejection_reason: string | null
          search_vector: unknown
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id: string
          city_id: number
          condition: string
          created_at?: string
          currency?: string
          description: string
          id?: string
          neighborhood?: string | null
          owner_id: string
          price_cents?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          search_vector?: unknown
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          city_id?: number
          condition?: string
          created_at?: string
          currency?: string
          description?: string
          id?: string
          neighborhood?: string | null
          owner_id?: string
          price_cents?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          search_vector?: unknown
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classifieds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "classified_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classifieds_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      public_place_categories: {
        Row: {
          created_at: string
          description: string | null
          is_active: boolean
          key: string
          label: string
          parent_key: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          key: string
          label: string
          parent_key?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          is_active?: boolean
          key?: string
          label?: string
          parent_key?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_place_categories_parent_key_fkey"
            columns: ["parent_key"]
            isOneToOne: false
            referencedRelation: "public_place_categories"
            referencedColumns: ["key"]
          },
        ]
      }
      public_places: {
        Row: {
          address_text: string | null
          category_key: string
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          location: unknown
          metadata: Json
          name: string
          neighborhood_label: string | null
          phone: string | null
          postal_code: string | null
          quality_status: string
          source_id: string
          source_snapshot_id: string
          source_updated_at: string | null
          status: string
          territory_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address_text?: string | null
          category_key: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          location?: unknown
          metadata?: Json
          name: string
          neighborhood_label?: string | null
          phone?: string | null
          postal_code?: string | null
          quality_status?: string
          source_id: string
          source_snapshot_id: string
          source_updated_at?: string | null
          status?: string
          territory_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_text?: string | null
          category_key?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          location?: unknown
          metadata?: Json
          name?: string
          neighborhood_label?: string | null
          phone?: string | null
          postal_code?: string | null
          quality_status?: string
          source_id?: string
          source_snapshot_id?: string
          source_updated_at?: string | null
          status?: string
          territory_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_places_category_key_fkey"
            columns: ["category_key"]
            isOneToOne: false
            referencedRelation: "public_place_categories"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "public_places_snapshot_source_fkey"
            columns: ["source_snapshot_id", "source_id"]
            isOneToOne: false
            referencedRelation: "territory_data_snapshots"
            referencedColumns: ["id", "source_id"]
          },
          {
            foreignKeyName: "public_places_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "public_place_catalog"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "public_places_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "territory_data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_places_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "territory_fact_catalog"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "public_places_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_places_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territories: {
        Row: {
          center: unknown
          country_code: string | null
          created_at: string
          geographic_path: string
          ibge_code: string | null
          id: string
          metadata: Json
          name: string
          parent_id: string | null
          slug: string
          state_code: string | null
          status: string
          timezone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          center?: unknown
          country_code?: string | null
          created_at?: string
          geographic_path: string
          ibge_code?: string | null
          id?: string
          metadata?: Json
          name: string
          parent_id?: string | null
          slug: string
          state_code?: string | null
          status?: string
          timezone?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          center?: unknown
          country_code?: string | null
          created_at?: string
          geographic_path?: string
          ibge_code?: string | null
          id?: string
          metadata?: Json
          name?: string
          parent_id?: string | null
          slug?: string
          state_code?: string | null
          status?: string
          timezone?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_boundaries: {
        Row: {
          created_at: string
          geometry: unknown
          imported_at: string
          metadata: Json
          source_name: string
          source_object_id: string | null
          source_updated_at: string | null
          source_url: string | null
          territory_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          geometry: unknown
          imported_at?: string
          metadata?: Json
          source_name: string
          source_object_id?: string | null
          source_updated_at?: string | null
          source_url?: string | null
          territory_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          geometry?: unknown
          imported_at?: string
          metadata?: Json
          source_name?: string
          source_object_id?: string | null
          source_updated_at?: string | null
          source_url?: string | null
          territory_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_boundaries_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: true
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_boundaries_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: true
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_data_snapshots: {
        Row: {
          checksum_sha256: string | null
          created_at: string
          fetched_at: string
          id: string
          is_public: boolean
          metadata: Json
          source_id: string
          source_published_at: string | null
          source_version: string | null
          status: string
          updated_at: string
        }
        Insert: {
          checksum_sha256?: string | null
          created_at?: string
          fetched_at?: string
          id?: string
          is_public?: boolean
          metadata?: Json
          source_id: string
          source_published_at?: string | null
          source_version?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          checksum_sha256?: string | null
          created_at?: string
          fetched_at?: string
          id?: string
          is_public?: boolean
          metadata?: Json
          source_id?: string
          source_published_at?: string | null
          source_version?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_data_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "public_place_catalog"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "territory_data_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "territory_data_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_data_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "territory_fact_catalog"
            referencedColumns: ["source_id"]
          },
        ]
      }
      territory_data_sources: {
        Row: {
          attribution: string | null
          created_at: string
          dataset_name: string
          id: string
          ingestion_method: string
          is_public: boolean
          key: string
          license_name: string | null
          license_url: string | null
          metadata: Json
          provider_name: string
          source_url: string
          status: string
          updated_at: string
        }
        Insert: {
          attribution?: string | null
          created_at?: string
          dataset_name: string
          id?: string
          ingestion_method: string
          is_public?: boolean
          key: string
          license_name?: string | null
          license_url?: string | null
          metadata?: Json
          provider_name: string
          source_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          attribution?: string | null
          created_at?: string
          dataset_name?: string
          id?: string
          ingestion_method?: string
          is_public?: boolean
          key?: string
          license_name?: string | null
          license_url?: string | null
          metadata?: Json
          provider_name?: string
          source_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      territory_facts: {
        Row: {
          created_at: string
          dimensions: Json
          id: string
          metadata: Json
          metric_key: string
          quality_status: string
          reference_period: string
          source_record_id: string | null
          source_snapshot_id: string
          territory_id: string
          unit: string | null
          updated_at: string
          value_boolean: boolean | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          dimensions?: Json
          id?: string
          metadata?: Json
          metric_key: string
          quality_status?: string
          reference_period: string
          source_record_id?: string | null
          source_snapshot_id: string
          territory_id: string
          unit?: string | null
          updated_at?: string
          value_boolean?: boolean | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          dimensions?: Json
          id?: string
          metadata?: Json
          metric_key?: string
          quality_status?: string
          reference_period?: string
          source_record_id?: string | null
          source_snapshot_id?: string
          territory_id?: string
          unit?: string | null
          updated_at?: string
          value_boolean?: boolean | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territory_facts_metric_key_fkey"
            columns: ["metric_key"]
            isOneToOne: false
            referencedRelation: "territory_metric_definitions"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "territory_facts_source_snapshot_id_fkey"
            columns: ["source_snapshot_id"]
            isOneToOne: false
            referencedRelation: "territory_data_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_facts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_facts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_group_members: {
        Row: {
          created_at: string
          group_id: string
          territory_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          territory_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          territory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "territory_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_group_members_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_group_members_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_groups: {
        Row: {
          anchor_city_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          anchor_city_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          anchor_city_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_groups_anchor_city_id_fkey"
            columns: ["anchor_city_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_groups_anchor_city_id_fkey"
            columns: ["anchor_city_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_metric_definitions: {
        Row: {
          created_at: string
          default_unit: string | null
          description: string | null
          key: string
          label: string
          metadata: Json
          sort_order: number
          status: string
          updated_at: string
          value_type: string
        }
        Insert: {
          created_at?: string
          default_unit?: string | null
          description?: string | null
          key: string
          label: string
          metadata?: Json
          sort_order?: number
          status?: string
          updated_at?: string
          value_type: string
        }
        Update: {
          created_at?: string
          default_unit?: string | null
          description?: string | null
          key?: string
          label?: string
          metadata?: Json
          sort_order?: number
          status?: string
          updated_at?: string
          value_type?: string
        }
        Relationships: []
      }
      territory_rollouts: {
        Row: {
          activated_at: string | null
          created_at: string
          group_id: string | null
          id: string
          stage: string
          territory_id: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          stage?: string
          territory_id?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          stage?: string
          territory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_rollouts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "territory_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_rollouts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_rollouts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
    }
    Views: {
      public_place_catalog: {
        Row: {
          address_text: string | null
          attribution: string | null
          category_key: string | null
          category_label: string | null
          dataset_name: string | null
          description: string | null
          external_id: string | null
          fetched_at: string | null
          geographic_path: string | null
          id: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          neighborhood_label: string | null
          phone: string | null
          postal_code: string | null
          provider_name: string | null
          source_id: string | null
          source_key: string | null
          source_snapshot_id: string | null
          source_updated_at: string | null
          source_url: string | null
          source_version: string | null
          territory_id: string | null
          territory_name: string | null
          territory_slug: string | null
          website: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_places_category_key_fkey"
            columns: ["category_key"]
            isOneToOne: false
            referencedRelation: "public_place_categories"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "public_places_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_places_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_boundary_catalog: {
        Row: {
          area_m2: number | null
          bbox_geojson: Json | null
          center_latitude: number | null
          center_longitude: number | null
          geographic_path: string | null
          geojson: Json | null
          imported_at: string | null
          name: string | null
          slug: string | null
          source_name: string | null
          source_object_id: string | null
          source_url: string | null
          territory_id: string | null
          territory_type: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      territory_fact_catalog: {
        Row: {
          attribution: string | null
          dataset_name: string | null
          dimensions: Json | null
          fetched_at: string | null
          geographic_path: string | null
          id: string | null
          metric_key: string | null
          metric_label: string | null
          provider_name: string | null
          reference_period: string | null
          source_id: string | null
          source_key: string | null
          source_record_id: string | null
          source_snapshot_id: string | null
          source_url: string | null
          source_version: string | null
          territory_id: string | null
          territory_name: string | null
          territory_slug: string | null
          unit: string | null
          value_boolean: boolean | null
          value_numeric: number | null
          value_text: string | null
        }
        Relationships: [
          {
            foreignKeyName: "territory_facts_metric_key_fkey"
            columns: ["metric_key"]
            isOneToOne: false
            referencedRelation: "territory_metric_definitions"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "territory_facts_source_snapshot_id_fkey"
            columns: ["source_snapshot_id"]
            isOneToOne: false
            referencedRelation: "territory_data_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_facts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "territory_facts_territory_id_fkey"
            columns: ["territory_id"]
            isOneToOne: false
            referencedRelation: "territory_boundary_catalog"
            referencedColumns: ["territory_id"]
          },
        ]
      }
      territory_rollout_catalog: {
        Row: {
          activated_at: string | null
          geographic_path: string | null
          id: string | null
          name: string | null
          slug: string | null
          stage: string | null
          target_id: string | null
          target_kind: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      submit_classified_for_review: {
        Args: { p_classified_id: string }
        Returns: undefined
      }
      withdraw_classified_from_review: {
        Args: { p_classified_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
