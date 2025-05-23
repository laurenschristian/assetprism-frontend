import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string
          employee_id: string | null
          full_name: string | null
          department_id: string | null
          role: 'super_admin' | 'org_admin' | 'asset_manager' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id: string
          employee_id?: string | null
          full_name?: string | null
          department_id?: string | null
          role?: 'super_admin' | 'org_admin' | 'asset_manager' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          employee_id?: string | null
          full_name?: string | null
          department_id?: string | null
          role?: 'super_admin' | 'org_admin' | 'asset_manager' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      software_licenses: {
        Row: {
          id: string
          organization_id: string
          software_title_id: string
          license_type: 'perpetual' | 'subscription' | 'named_user' | 'device_based' | 'concurrent'
          license_model: 'per_user' | 'per_device' | 'site_license' | 'enterprise'
          purchased_units: number
          available_units: number
          license_key: string | null
          usage_rights: string | null
          purchase_date: string | null
          purchase_cost: number | null
          vendor_id: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          renewal_date: string | null
          maintenance_expiration_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          software_title_id: string
          license_type?: 'perpetual' | 'subscription' | 'named_user' | 'device_based' | 'concurrent'
          license_model?: 'per_user' | 'per_device' | 'site_license' | 'enterprise'
          purchased_units?: number
          available_units?: number
          license_key?: string | null
          usage_rights?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          vendor_id?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          renewal_date?: string | null
          maintenance_expiration_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          software_title_id?: string
          license_type?: 'perpetual' | 'subscription' | 'named_user' | 'device_based' | 'concurrent'
          license_model?: 'per_user' | 'per_device' | 'site_license' | 'enterprise'
          purchased_units?: number
          available_units?: number
          license_key?: string | null
          usage_rights?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          vendor_id?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          renewal_date?: string | null
          maintenance_expiration_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'org_admin' | 'asset_manager' | 'viewer'
      assignment_type: 'user' | 'device'
      asset_status: 'in_stock' | 'assigned' | 'maintenance' | 'retired' | 'disposed'
      license_type: 'perpetual' | 'subscription' | 'named_user' | 'device_based' | 'concurrent'
      license_model: 'per_user' | 'per_device' | 'site_license' | 'enterprise'
    }
  }
} 