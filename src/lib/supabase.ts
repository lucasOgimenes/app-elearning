import { createClient } from '@supabase/supabase-js'

// Configuração com fallbacks para desenvolvimento
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Verificar se as variáveis estão configuradas
const isConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Flag para verificar se o Supabase está configurado
export const isSupabaseConfigured = isConfigured

// Tipos para o banco de dados
export type CategoriaEnum = 'day_trade' | 'criptomoedas' | 'renda_passiva'
export type RemetenteEnum = 'user' | 'ia'

export interface User {
  id: string
  email: string
  nome: string
  is_premium: boolean
  is_admin: boolean
  created_at: string
}

export interface Curso {
  id: string
  categoria: CategoriaEnum
  titulo: string
  url_video: string
  descricao: string
  duracao_minutos: number
  is_active: boolean
  created_at: string
}

export interface Podcast {
  id: string
  categoria: CategoriaEnum
  titulo: string
  url_audio: string
  descricao: string
  is_active: boolean
  created_at: string
}

export interface BibliotecaLink {
  id: string
  categoria: CategoriaEnum
  titulo: string
  url_youtube: string
  descricao: string
  is_active: boolean
  created_at: string
}

export interface MensagemVip {
  id: string
  user_id: string
  categoria: CategoriaEnum
  remetente: RemetenteEnum
  conteudo: string
  data_criacao: string
}

export interface PaymentLog {
  id: string
  user_id: string
  transaction_id: string
  receipt_data?: string
  status: string
  data_compra: string
}