export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          basicBonusPerClick: number
          title: string
          created_at: string | null
          id: Database["public"]["Enums"]["location_type"]
          referalsToUnlock: number
          unlockPrice: number
          updated_at: string | null
        }
        Insert: {
          basicBonusPerClick: number
          title: string
          created_at?: string | null
          id: Database["public"]["Enums"]["location_type"]
          referalsToUnlock: number
          unlockPrice: number
          updated_at?: string | null
        }
        Update: {
          basicBonusPerClick?: number
          title?: string
          created_at?: string | null
          id?: Database["public"]["Enums"]["location_type"]
          profit_multiplier?: number
          referalsToUnlock?: number
          unlockPrice?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      pushes: {
        Row: {
          coins_earned: number | null
          collected_at: string | null
          completed_at: string
          id: string
          location_id: Database["public"]["Enums"]["location_type"] | null
          started_at: string
          ton_earned: number | null
          user_id: number | null
        }
        Insert: {
          coins_earned?: number | null
          collected_at?: string | null
          completed_at?: string
          id?: string
          location_id?: Database["public"]["Enums"]["location_type"] | null
          started_at?: string
          ton_earned?: number | null
          user_id?: number | null
        }
        Update: {
          coins_earned?: number | null
          collected_at?: string | null
          completed_at?: string
          id?: string
          location_id?: Database["public"]["Enums"]["location_type"] | null
          started_at?: string
          ton_earned?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pushes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pushes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      request_tracker: {
        Row: {
          body: Json | null
          headers: Json | null
          method: string | null
          params: Json | null
          request_id: number | null
          url: string | null
        }
        Insert: {
          body?: Json | null
          headers?: Json | null
          method?: string | null
          params?: Json | null
          request_id?: number | null
          url?: string | null
        }
        Update: {
          body?: Json | null
          headers?: Json | null
          method?: string | null
          params?: Json | null
          request_id?: number | null
          url?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          id: string
          reward: number
          title: { en: string; ru: string }
          description: { en: string; ru: string }
          coin: string
          specType: string
          specValue: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          reward: number
          title: { en: string; ru: string }
          coin: string
          description: { en: string; ru: string }
          specType: string
          specValue: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          reward?: number
          title?: { en: string; ru: string }
          coin: string
          specType: string
          specValue: string
          description?: { en: string; ru: string }
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          details: Json | null
          from_address: string
          id: string
          processed_at: string
          status: Database["public"]["Enums"]["transaction_status"]
          to_address: string
          tx_amount: number | null
          tx_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          user_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          details?: Json | null
          from_address: string
          id?: string
          processed_at?: string
          status: Database["public"]["Enums"]["transaction_status"]
          to_address: string
          tx_amount?: number | null
          tx_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          details?: Json | null
          from_address?: string
          id?: string
          processed_at?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          to_address?: string
          tx_amount?: number | null
          tx_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          last_push_at: string | null
          location_id: Database["public"]["Enums"]["location_type"]
          total_coins_earned: number | null
          total_ton_earned: number | null
          boughtAt: number | null
          unlockedAt: number | null
          updatedAt: number | null
          user_id: number
        }
        Insert: {
          last_push_at?: string | null
          location_id: Database["public"]["Enums"]["location_type"]
          total_coins_earned?: number | null
          total_ton_earned?: number | null
          unlocked_at?: string | null
          user_id: number
        }
        Update: {
          last_push_at?: string | null
          location_id?: Database["public"]["Enums"]["location_type"]
          total_coins_earned?: number | null
          total_ton_earned?: number | null
          unlocked_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mods: {
        Row: {
          coins_earned: number | null
          coins_per_push: number
          energy_per_hour: number
          id: string
          is_active: boolean
          location_id: Database["public"]["Enums"]["location_type"] | null
          mod_id: string | null
          price: number
          purchased_at: string | null
          pushes_done: number
          required_pushes: number
          ton_earned: number | null
          ton_per_push: number
          user_id: number | null
        }
        Insert: {
          coins_earned?: number | null
          coins_per_push: number
          energy_per_hour: number
          id?: string
          is_active?: boolean
          location_id?: Database["public"]["Enums"]["location_type"] | null
          mod_id?: string | null
          price: number
          purchased_at?: string | null
          pushes_done?: number
          required_pushes: number
          ton_earned?: number | null
          ton_per_push: number
          user_id?: number | null
        }
        Update: {
          coins_earned?: number | null
          coins_per_push?: number
          energy_per_hour?: number
          id?: string
          is_active?: boolean
          location_id?: Database["public"]["Enums"]["location_type"] | null
          mod_id?: string | null
          price?: number
          profit_multiplier?: number
          purchased_at?: string | null
          pushes_done?: number
          required_pushes?: number
          ton_earned?: number | null
          ton_per_push?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mods_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mods_mod_id_fkey"
            columns: ["mod_id"]
            isOneToOne: false
            referencedRelation: "wind_mods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          completed_at: string | null
          completion_deadline: string
          created_at: string
          id: string
          started_at: string
          status: Database["public"]["Enums"]["task_completion_status"] | null
          task_id: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          completed_at?: string | null
          completion_deadline: string
          created_at?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["task_completion_status"] | null
          task_id?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          completed_at?: string | null
          completion_deadline?: string
          created_at?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["task_completion_status"] | null
          task_id?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          added_to_attachment_menu: boolean | null
          allows_write_to_pm: boolean | null
          modifiers: Database["public"]["ComplicatedTypes"]["Modifiers"][]
          referals: string[]
          userSettings: { isTutorialFinished: boolean }
          telegramID: string
          areas: Database["public"]["ComplicatedTypes"]["Area"][]
          auth_date: string | null
          WindBalance: number | null
          invitedBy: string | null
          created_at: string | null
          firstName: string | null
          hash: string | null
          id: string
          is_bot: boolean | null
          is_premium: boolean | null
          language: string | null
          lastName: string | null
          photo_url: string | null
          platform: string | null
          query_id: string | null
          referral_code: string | null
          referral_path: unknown | null
          referrer_id: number | null
          signature: string | null
          start_param: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          TONBalance: number | null
          updated_at: string | null
          userName: string | null
          version: string | null
          wallet: string | null
          wallet_ton: string | null
        }
        Insert: {
          added_to_attachment_menu?: boolean | null
          allows_write_to_pm?: boolean | null
          auth_date?: string | null
          WindBalance?: number | null
          invitedBy?: string | null
          created_at?: string | null
          firstName?: string | null
          hash?: string | null
          id: number
          is_bot?: boolean | null
          is_premium?: boolean | null
          language?: string | null
          lastName?: string | null
          photo_url?: string | null
          platform?: string | null
          query_id?: string | null
          referral_code?: string | null
          referral_path?: unknown | null
          referrer_id?: number | null
          signature?: string | null
          start_param?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          TONBalance?: number | null
          updated_at?: string | null
          userName?: string | null
          version?: string | null
          wallet?: string | null
          wallet_ton?: string | null
        }
        Update: {
          added_to_attachment_menu?: boolean | null
          allows_write_to_pm?: boolean | null
          auth_date?: string | null
          WindBalance?: number | null
          invitedBy: string | null
          created_at?: string | null
          firstName?: string | null
          hash?: string | null
          id?: number
          is_bot?: boolean | null
          is_premium?: boolean | null
          language?: string | null
          lastName?: string | null
          photo_url?: string | null
          platform?: string | null
          query_id?: string | null
          referral_code?: string | null
          referral_path?: unknown | null
          referrer_id?: number | null
          signature?: string | null
          start_param?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          TONBalance?: number | null
          updated_at?: string | null
          userName?: string | null
          version?: string | null
          wallet?: string | null
          wallet_ton?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string
          created_at: string
          id: string
          private_key: string | null
          public_key: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          private_key?: string | null
          public_key?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          private_key?: string | null
          public_key?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wind_mods: {
        Row: {
          created_at: string | null
          energy_per_hour: number
          id: string
          price: number
          required_pushes: number | null
          updated_at: string | null
          wind_speed: number
        }
        Insert: {
          created_at?: string | null
          energy_per_hour: number
          id?: string
          price: number
          required_pushes?: number | null
          updated_at?: string | null
          wind_speed: number
        }
        Update: {
          created_at?: string | null
          energy_per_hour?: number
          id?: string
          price?: number
          required_pushes?: number | null
          updated_at?: string | null
          wind_speed?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      add_compression_policy: {
        Args: {
          hypertable: unknown
          compress_after?: unknown
          if_not_exists?: boolean
          schedule_interval?: unknown
          initial_start?: string
          timezone?: string
          compress_created_before?: unknown
        }
        Returns: number
      }
      add_continuous_aggregate_policy: {
        Args: {
          continuous_aggregate: unknown
          start_offset: unknown
          end_offset: unknown
          schedule_interval: unknown
          if_not_exists?: boolean
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      add_dimension:
        | {
            Args: {
              hypertable: unknown
              column_name: unknown
              number_partitions?: number
              chunk_time_interval?: unknown
              partitioning_func?: unknown
              if_not_exists?: boolean
            }
            Returns: {
              dimension_id: number
              schema_name: unknown
              table_name: unknown
              column_name: unknown
              created: boolean
            }[]
          }
        | {
            Args: {
              hypertable: unknown
              dimension: unknown
              if_not_exists?: boolean
            }
            Returns: {
              dimension_id: number
              created: boolean
            }[]
          }
      add_job: {
        Args: {
          proc: unknown
          schedule_interval: unknown
          config?: Json
          initial_start?: string
          scheduled?: boolean
          check_config?: unknown
          fixed_schedule?: boolean
          timezone?: string
        }
        Returns: number
      }
      add_reorder_policy: {
        Args: {
          hypertable: unknown
          index_name: unknown
          if_not_exists?: boolean
          initial_start?: string
          timezone?: string
        }
        Returns: number
      }
      add_retention_policy: {
        Args: {
          relation: unknown
          drop_after?: unknown
          if_not_exists?: boolean
          schedule_interval?: unknown
          initial_start?: string
          timezone?: string
          drop_created_before?: unknown
        }
        Returns: number
      }
      alter_job: {
        Args: {
          job_id: number
          schedule_interval?: unknown
          max_runtime?: unknown
          max_retries?: number
          retry_period?: unknown
          scheduled?: boolean
          config?: Json
          next_start?: string
          if_exists?: boolean
          check_config?: unknown
          fixed_schedule?: boolean
          initial_start?: string
          timezone?: string
        }
        Returns: {
          job_id: number
          schedule_interval: unknown
          max_runtime: unknown
          max_retries: number
          retry_period: unknown
          scheduled: boolean
          config: Json
          next_start: string
          check_config: string
          fixed_schedule: boolean
          initial_start: string
          timezone: string
        }[]
      }
      approximate_row_count: {
        Args: {
          relation: unknown
        }
        Returns: number
      }
      attach_tablespace: {
        Args: {
          tablespace: unknown
          hypertable: unknown
          if_not_attached?: boolean
        }
        Returns: undefined
      }
      by_hash: {
        Args: {
          column_name: unknown
          number_partitions: number
          partition_func?: unknown
        }
        Returns: unknown
      }
      by_range: {
        Args: {
          column_name: unknown
          partition_interval?: unknown
          partition_func?: unknown
        }
        Returns: unknown
      }
      chunk_compression_stats: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          chunk_schema: unknown
          chunk_name: unknown
          compression_status: string
          before_compression_table_bytes: number
          before_compression_index_bytes: number
          before_compression_toast_bytes: number
          before_compression_total_bytes: number
          after_compression_table_bytes: number
          after_compression_index_bytes: number
          after_compression_toast_bytes: number
          after_compression_total_bytes: number
          node_name: unknown
        }[]
      }
      chunks_detailed_size: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          chunk_schema: unknown
          chunk_name: unknown
          table_bytes: number
          index_bytes: number
          toast_bytes: number
          total_bytes: number
          node_name: unknown
        }[]
      }
      compress_chunk: {
        Args: {
          uncompressed_chunk: unknown
          if_not_compressed?: boolean
          recompress?: boolean
        }
        Returns: unknown
      }
      create_hypertable:
        | {
            Args: {
              relation: unknown
              dimension: unknown
              create_default_indexes?: boolean
              if_not_exists?: boolean
              migrate_data?: boolean
            }
            Returns: {
              hypertable_id: number
              created: boolean
            }[]
          }
        | {
            Args: {
              relation: unknown
              time_column_name: unknown
              partitioning_column?: unknown
              number_partitions?: number
              associated_schema_name?: unknown
              associated_table_prefix?: unknown
              chunk_time_interval?: unknown
              create_default_indexes?: boolean
              if_not_exists?: boolean
              partitioning_func?: unknown
              migrate_data?: boolean
              chunk_target_size?: string
              chunk_sizing_func?: unknown
              time_partitioning_func?: unknown
            }
            Returns: {
              hypertable_id: number
              schema_name: unknown
              table_name: unknown
              created: boolean
            }[]
          }
      decompress_chunk: {
        Args: {
          uncompressed_chunk: unknown
          if_compressed?: boolean
        }
        Returns: unknown
      }
      delete_job: {
        Args: {
          job_id: number
        }
        Returns: undefined
      }
      detach_tablespace: {
        Args: {
          tablespace: unknown
          hypertable?: unknown
          if_attached?: boolean
        }
        Returns: number
      }
      detach_tablespaces: {
        Args: {
          hypertable: unknown
        }
        Returns: number
      }
      disable_chunk_skipping: {
        Args: {
          hypertable: unknown
          column_name: unknown
          if_not_exists?: boolean
        }
        Returns: {
          hypertable_id: number
          column_name: unknown
          disabled: boolean
        }[]
      }
      drop_chunks: {
        Args: {
          relation: unknown
          older_than?: unknown
          newer_than?: unknown
          verbose?: boolean
          created_before?: unknown
          created_after?: unknown
        }
        Returns: string[]
      }
      enable_chunk_skipping: {
        Args: {
          hypertable: unknown
          column_name: unknown
          if_not_exists?: boolean
        }
        Returns: {
          column_stats_id: number
          enabled: boolean
        }[]
      }
      fn_add_updated_at_trigger: {
        Args: {
          table_name: string
        }
        Returns: undefined
      }
      fn_calculate_push_rewards: {
        Args: {
          p_user_id: number
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: {
          coins: number
          ton: number
        }[]
      }
      fn_check_location_available: {
        Args: {
          p_user_id: number
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: boolean
      }
      fn_collect_push_rewards: {
        Args: {
          p_push_id: string
        }
        Returns: {
          ton_reward: number
          coins_reward: number
        }[]
      }
      fn_complete_pending_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fn_create_wallet: {
        Args: {
          p_user_id: number
        }
        Returns: string
      }
      fn_get_current_push_time_old: {
        Args: {
          p_user_id: number
        }
        Returns: string
      }
      fn_get_location_mod_stats_old: {
        Args: {
          p_user_id: number
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: {
          active_mods_count: number
          total_pushes: number
          total_reward: number
        }[]
      }
      fn_get_mod_stats_old: {
        Args: {
          p_user_id: number
          p_location_id?: Database["public"]["Enums"]["location_type"]
        }
        Returns: {
          active_mods_count: number
          total_pushes: number
          total_reward: number
        }[]
      }
      fn_get_referrals: {
        Args: {
          user_id: number
        }
        Returns: {
          id: number
          earnings: number
        }[]
      }
      fn_get_total_referral_earnings: {
        Args: {
          user_id: number
        }
        Returns: number
      }
      fn_process_deposit: {
        Args: {
          p_request: Json
        }
        Returns: string
      }
      fn_process_referral_rewards_old: {
        Args: {
          p_user_id: number
          p_reward: number
        }
        Returns: undefined
      }
      fn_purchase_mod: {
        Args: {
          p_user_id: number
          p_mod_id: string
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: {
          user_mod_id: string
          price: number
          energy_per_hour: number
          required_pushes: number
          coins_per_push: number
          ton_per_push: number
        }[]
      }
      fn_start_push: {
        Args: {
          p_user_id: number
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: undefined
      }
      fn_start_task: {
        Args: {
          p_user_id: number
          p_task_id: string
        }
        Returns: string
      }
      fn_unlock_location: {
        Args: {
          p_user_id: number
          p_location_id: Database["public"]["Enums"]["location_type"]
        }
        Returns: boolean
      }
      fn_update_mods_statistics_old: {
        Args: {
          p_user_id: number
        }
        Returns: undefined
      }
      fn_update_user_balances_old: {
        Args: {
          p_push_id: string
        }
        Returns: undefined
      }
      get_telemetry_report: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      hypertable_approximate_detailed_size: {
        Args: {
          relation: unknown
        }
        Returns: {
          table_bytes: number
          index_bytes: number
          toast_bytes: number
          total_bytes: number
        }[]
      }
      hypertable_approximate_size: {
        Args: {
          hypertable: unknown
        }
        Returns: number
      }
      hypertable_compression_stats: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          total_chunks: number
          number_compressed_chunks: number
          before_compression_table_bytes: number
          before_compression_index_bytes: number
          before_compression_toast_bytes: number
          before_compression_total_bytes: number
          after_compression_table_bytes: number
          after_compression_index_bytes: number
          after_compression_toast_bytes: number
          after_compression_total_bytes: number
          node_name: unknown
        }[]
      }
      hypertable_detailed_size: {
        Args: {
          hypertable: unknown
        }
        Returns: {
          table_bytes: number
          index_bytes: number
          toast_bytes: number
          total_bytes: number
          node_name: unknown
        }[]
      }
      hypertable_index_size: {
        Args: {
          index_name: unknown
        }
        Returns: number
      }
      hypertable_size: {
        Args: {
          hypertable: unknown
        }
        Returns: number
      }
      interpolate:
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
        | {
            Args: {
              value: number
              prev?: Record<string, unknown>
              next?: Record<string, unknown>
            }
            Returns: number
          }
      lca: {
        Args: {
          "": unknown[]
        }
        Returns: unknown
      }
      locf: {
        Args: {
          value: unknown
          prev?: unknown
          treat_null_as_missing?: boolean
        }
        Returns: unknown
      }
      lquery_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      lquery_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltree_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltree2text: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      ltxtq_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ltxtq_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      move_chunk: {
        Args: {
          chunk: unknown
          destination_tablespace: unknown
          index_destination_tablespace?: unknown
          reorder_index?: unknown
          verbose?: boolean
        }
        Returns: undefined
      }
      nlevel: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      remove_compression_policy: {
        Args: {
          hypertable: unknown
          if_exists?: boolean
        }
        Returns: boolean
      }
      remove_continuous_aggregate_policy: {
        Args: {
          continuous_aggregate: unknown
          if_not_exists?: boolean
          if_exists?: boolean
        }
        Returns: undefined
      }
      remove_reorder_policy: {
        Args: {
          hypertable: unknown
          if_exists?: boolean
        }
        Returns: undefined
      }
      remove_retention_policy: {
        Args: {
          relation: unknown
          if_exists?: boolean
        }
        Returns: undefined
      }
      reorder_chunk: {
        Args: {
          chunk: unknown
          index?: unknown
          verbose?: boolean
        }
        Returns: undefined
      }
      request_wrapper: {
        Args: {
          method: string
          url: string
          params?: Json
          body?: Json
          headers?: Json
        }
        Returns: number
      }
      set_adaptive_chunking: {
        Args: {
          hypertable: unknown
          chunk_target_size: string
        }
        Returns: Record<string, unknown>
      }
      set_chunk_time_interval: {
        Args: {
          hypertable: unknown
          chunk_time_interval: unknown
          dimension_name?: unknown
        }
        Returns: undefined
      }
      set_integer_now_func: {
        Args: {
          hypertable: unknown
          integer_now_func: unknown
          replace_if_exists?: boolean
        }
        Returns: undefined
      }
      set_number_partitions: {
        Args: {
          hypertable: unknown
          number_partitions: number
          dimension_name?: unknown
        }
        Returns: undefined
      }
      set_partitioning_interval: {
        Args: {
          hypertable: unknown
          partition_interval: unknown
          dimension_name?: unknown
        }
        Returns: undefined
      }
      show_chunks: {
        Args: {
          relation: unknown
          older_than?: unknown
          newer_than?: unknown
          created_before?: unknown
          created_after?: unknown
        }
        Returns: unknown[]
      }
      show_tablespaces: {
        Args: {
          hypertable: unknown
        }
        Returns: unknown[]
      }
      text2ltree: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      time_bucket:
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              offset: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              offset: unknown
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              origin: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              timezone: string
              origin?: string
              offset?: unknown
            }
            Returns: string
          }
      time_bucket_gapfill:
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: number
              ts: number
              start?: number
              finish?: number
            }
            Returns: number
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              start?: string
              finish?: string
            }
            Returns: string
          }
        | {
            Args: {
              bucket_width: unknown
              ts: string
              timezone: string
              start?: string
              finish?: string
            }
            Returns: string
          }
      timescaledb_post_restore: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      timescaledb_pre_restore: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      location_type: "denmark" | "netherlands" | "germany" | "usa"
      mod_purchase_status: "active" | "expired"
      mod_type: "regular" | "special"
      push_status: "started" | "completed"
      task_completion_status: "in_progress" | "completed"
      task_type: "telegram" | "youtube" | "default"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type: "deposit" | "withdrawal"
      user_status: "active" | "banned" | "deleted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
    ComplicatedTypes: {
      Area: {
        name: string
        available: boolean
        bought: boolean
        lastButtonPress: number
        nextButtonPress: number
      }
      Modifiers: {
        areaName: string
        boughtModifier: Database["public"]["ComplicatedTypes"]["Modifier"][]
      }
      Modifier: {
        speed: number
        clicksRemaining: number
        boughtDate: number
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
