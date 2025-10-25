import { supabase, isSupabaseConfigured, type User, type Curso, type Podcast, type BibliotecaLink, type MensagemVip, type CategoriaEnum } from './supabase'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Configuração do Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'demo-key')

// Verificar se o Supabase está configurado
const checkSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Configure as variáveis de ambiente primeiro.')
  }
}

// Funções de Autenticação
export const authService = {
  async signUp(email: string, password: string, nome: string) {
    checkSupabaseConfig()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            nome,
            is_premium: false,
            is_admin: false,
          },
        ])

      if (profileError) throw profileError
    }

    return authData
  },

  async signIn(email: string, password: string) {
    checkSupabaseConfig()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    checkSupabaseConfig()
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return null
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  }
}

// Funções de Conteúdo
export const contentService = {
  async getCursos(categoria?: CategoriaEnum): Promise<Curso[]> {
    if (!isSupabaseConfigured) {
      return getMockCursos(categoria)
    }
    
    let query = supabase
      .from('cursos')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getPodcasts(categoria?: CategoriaEnum): Promise<Podcast[]> {
    if (!isSupabaseConfigured) {
      return getMockPodcasts(categoria)
    }
    
    let query = supabase
      .from('podcasts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getBibliotecaLinks(categoria?: CategoriaEnum): Promise<BibliotecaLink[]> {
    if (!isSupabaseConfigured) {
      return getMockBibliotecaLinks(categoria)
    }
    
    let query = supabase
      .from('biblioteca_links')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }
}

// Dados mock para demonstração quando Supabase não está configurado
const getMockCursos = (categoria?: CategoriaEnum): Curso[] => {
  const cursos = [
    {
      id: '1',
      categoria: 'day_trade' as CategoriaEnum,
      titulo: 'Análise Técnica para Iniciantes',
      url_video: 'https://www.exemplo.com/aula-dt-01',
      descricao: 'Aprenda os fundamentos da análise técnica e como interpretar gráficos de preços',
      duracao_minutos: 15,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      categoria: 'criptomoedas' as CategoriaEnum,
      titulo: 'Introdução ao Bitcoin e Blockchain',
      url_video: 'https://www.exemplo.com/aula-crypto-01',
      descricao: 'Entenda a tecnologia por trás das criptomoedas e seu potencial',
      duracao_minutos: 14,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      categoria: 'renda_passiva' as CategoriaEnum,
      titulo: 'Fundos Imobiliários: Guia Completo',
      url_video: 'https://www.exemplo.com/aula-rp-01',
      descricao: 'Como construir uma carteira sólida de FIIs para renda mensal',
      duracao_minutos: 16,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
  
  return categoria ? cursos.filter(c => c.categoria === categoria) : cursos
}

const getMockPodcasts = (categoria?: CategoriaEnum): Podcast[] => {
  const podcasts = [
    {
      id: '1',
      categoria: 'day_trade' as CategoriaEnum,
      titulo: 'Mindset do Trader Vencedor',
      url_audio: 'https://www.exemplo.com/podcast-dt-01.mp3',
      descricao: 'Conversas com traders profissionais sobre mentalidade e disciplina',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      categoria: 'criptomoedas' as CategoriaEnum,
      titulo: 'Bitcoin: O Ouro Digital',
      url_audio: 'https://www.exemplo.com/podcast-crypto-01.mp3',
      descricao: 'Discussões sobre o futuro do Bitcoin como reserva de valor',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      categoria: 'renda_passiva' as CategoriaEnum,
      titulo: 'FIIs: Construindo Patrimônio',
      url_audio: 'https://www.exemplo.com/podcast-rp-01.mp3',
      descricao: 'Estratégias para acumular fundos imobiliários de qualidade',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
  
  return categoria ? podcasts.filter(p => p.categoria === categoria) : podcasts
}

const getMockBibliotecaLinks = (categoria?: CategoriaEnum): BibliotecaLink[] => {
  const links = [
    {
      id: '1',
      categoria: 'day_trade' as CategoriaEnum,
      titulo: 'Setup de Trading Profissional',
      url_youtube: 'https://youtube.com/watch?v=dt123abc',
      descricao: 'Como montar uma estação de trabalho eficiente para day trade',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      categoria: 'criptomoedas' as CategoriaEnum,
      titulo: 'Mineração de Bitcoin Explicada',
      url_youtube: 'https://youtube.com/watch?v=crypto123abc',
      descricao: 'Como funciona a mineração e sua importância para a rede',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      categoria: 'renda_passiva' as CategoriaEnum,
      titulo: 'Carteira de Dividendos Balanceada',
      url_youtube: 'https://youtube.com/watch?v=rp123abc',
      descricao: 'Como construir uma carteira diversificada focada em dividendos',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
  
  return categoria ? links.filter(l => l.categoria === categoria) : links
}

// Funções VIP/Premium
export const vipService = {
  async getMensagensVip(userId: string, categoria: CategoriaEnum): Promise<MensagemVip[]> {
    checkSupabaseConfig()
    
    const { data, error } = await supabase
      .from('mensagens_vip')
      .select('*')
      .eq('user_id', userId)
      .eq('categoria', categoria)
      .order('data_criacao', { ascending: true })

    if (error) throw error
    return data || []
  },

  async enviarMensagem(userId: string, categoria: CategoriaEnum, conteudo: string): Promise<void> {
    checkSupabaseConfig()
    
    // Inserir mensagem do usuário
    const { error: userError } = await supabase
      .from('mensagens_vip')
      .insert([
        {
          user_id: userId,
          categoria,
          remetente: 'user',
          conteudo,
        },
      ])

    if (userError) throw userError

    // Gerar resposta da IA
    const resposta = await this.gerarRespostaIA(categoria, conteudo)

    // Inserir resposta da IA
    const { error: iaError } = await supabase
      .from('mensagens_vip')
      .insert([
        {
          user_id: userId,
          categoria,
          remetente: 'ia',
          conteudo: resposta,
        },
      ])

    if (iaError) throw iaError
  },

  async gerarRespostaIA(categoria: CategoriaEnum, pergunta: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const contextos = {
        day_trade: 'Você é um especialista em Day Trade com 15 anos de experiência. Responda de forma prática e educativa sobre análise técnica, gerenciamento de risco e estratégias de trading.',
        criptomoedas: 'Você é um especialista em criptomoedas e blockchain. Responda sobre tecnologia, análise de projetos, DeFi, NFTs e estratégias de investimento em crypto.',
        renda_passiva: 'Você é um especialista em investimentos e renda passiva. Responda sobre fundos imobiliários, dividendos, títulos públicos e estratégias de investimento de longo prazo.'
      }

      const prompt = `${contextos[categoria]}\n\nPergunta do usuário: ${pergunta}\n\nResponda de forma clara, educativa e prática em português brasileiro.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error)
      return 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente em alguns instantes.'
    }
  },

  async simularCompraVIP(userId: string): Promise<boolean> {
    checkSupabaseConfig()
    
    try {
      // Simular validação de recibo
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Log da transação
      const { error: logError } = await supabase
        .from('payments_log')
        .insert([
          {
            user_id: userId,
            transaction_id: transactionId,
            receipt_data: JSON.stringify({ simulated: true, timestamp: Date.now() }),
            status: 'completed',
          },
        ])

      if (logError) throw logError

      // Atualizar status premium do usuário
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_premium: true })
        .eq('id', userId)

      if (updateError) throw updateError

      return true
    } catch (error) {
      console.error('Erro ao processar compra VIP:', error)
      return false
    }
  }
}

// Funções Administrativas
export const adminService = {
  async promoverAdmin(userId: string, adminId: string): Promise<boolean> {
    checkSupabaseConfig()
    
    // Verificar se o usuário atual é admin
    const { data: admin } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', adminId)
      .single()

    if (!admin?.is_admin) {
      throw new Error('Acesso negado: usuário não é administrador')
    }

    // Promover usuário a admin
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('id', userId)

    if (error) throw error
    return true
  },

  async getUsuariosVIP(): Promise<User[]> {
    checkSupabaseConfig()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_premium', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async criarCurso(curso: Omit<Curso, 'id' | 'created_at'>): Promise<void> {
    checkSupabaseConfig()
    
    const { error } = await supabase
      .from('cursos')
      .insert([curso])

    if (error) throw error
  },

  async criarPodcast(podcast: Omit<Podcast, 'id' | 'created_at'>): Promise<void> {
    checkSupabaseConfig()
    
    const { error } = await supabase
      .from('podcasts')
      .insert([podcast])

    if (error) throw error
  },

  async criarBibliotecaLink(link: Omit<BibliotecaLink, 'id' | 'created_at'>): Promise<void> {
    checkSupabaseConfig()
    
    const { error } = await supabase
      .from('biblioteca_links')
      .insert([link])

    if (error) throw error
  },

  async toggleConteudoAtivo(tabela: string, id: string, isActive: boolean): Promise<void> {
    checkSupabaseConfig()
    
    const { error } = await supabase
      .from(tabela)
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw error
  },

  async deletarConteudo(tabela: string, id: string): Promise<void> {
    checkSupabaseConfig()
    
    const { error } = await supabase
      .from(tabela)
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}