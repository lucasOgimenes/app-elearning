'use client'

import { useState, useEffect } from 'react'
import { User, Play, BookOpen, Headphones, Link, MessageCircle, Settings, LogOut, Crown, TrendingUp, Bitcoin, PiggyBank, AlertCircle } from 'lucide-react'
import { authService, contentService, vipService, type User as UserType, type CategoriaEnum } from '@/lib/database'
import { getTema, formatarDuracao } from '@/lib/utils'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function AlphaFlow() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [telaAtual, setTelaAtual] = useState<'dashboard' | 'cursos' | 'podcasts' | 'biblioteca' | 'vip' | 'admin' | 'login'>('login')
  const [categoriaAtual, setCategoriaAtual] = useState<CategoriaEnum>('day_trade')
  const [cursos, setCursos] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [bibliotecaLinks, setBibliotecaLinks] = useState([])
  const [mensagensVip, setMensagensVip] = useState([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [enviandoMensagem, setEnviandoMensagem] = useState(false)

  // Dados de login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const tema = getTema(categoriaAtual)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      if (isSupabaseConfigured) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          if (currentUser.is_admin) {
            setTelaAtual('admin')
          } else {
            setTelaAtual('dashboard')
          }
        }
      } else {
        // Modo demonstração - mostrar dashboard sem autenticação
        setTelaAtual('dashboard')
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSupabaseConfigured) {
      alert('Configure o Supabase primeiro para usar autenticação!')
      return
    }
    
    setLoading(true)
    
    try {
      if (isSignUp) {
        await authService.signUp(email, password, nome)
        alert('Conta criada com sucesso! Verifique seu email.')
      } else {
        const { error } = await authService.signIn(email, password)
        if (error) throw error
        await checkUser()
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await authService.signOut()
    }
    setUser(null)
    setTelaAtual('login')
  }

  const carregarConteudo = async (categoria: CategoriaEnum) => {
    try {
      const [cursosData, podcastsData, bibliotecaData] = await Promise.all([
        contentService.getCursos(categoria),
        contentService.getPodcasts(categoria),
        contentService.getBibliotecaLinks(categoria)
      ])
      
      setCursos(cursosData)
      setPodcasts(podcastsData)
      setBibliotecaLinks(bibliotecaData)
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
    }
  }

  const carregarMensagensVip = async () => {
    if (!user || !isSupabaseConfigured) return
    
    try {
      const mensagens = await vipService.getMensagensVip(user.id, categoriaAtual)
      setMensagensVip(mensagens)
    } catch (error) {
      console.error('Erro ao carregar mensagens VIP:', error)
    }
  }

  const enviarMensagemVip = async () => {
    if (!user || !novaMensagem.trim() || !isSupabaseConfigured) return
    
    setEnviandoMensagem(true)
    try {
      await vipService.enviarMensagem(user.id, categoriaAtual, novaMensagem)
      setNovaMensagem('')
      await carregarMensagensVip()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      alert('Erro ao enviar mensagem')
    } finally {
      setEnviandoMensagem(false)
    }
  }

  const comprarVIP = async () => {
    if (!user || !isSupabaseConfigured) {
      alert('Configure o Supabase primeiro para usar funcionalidades VIP!')
      return
    }
    
    try {
      const sucesso = await vipService.simularCompraVIP(user.id)
      if (sucesso) {
        alert('Parabéns! Você agora é um usuário VIP!')
        await checkUser()
      } else {
        alert('Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Erro ao comprar VIP:', error)
      alert('Erro ao processar pagamento')
    }
  }

  useEffect(() => {
    if (telaAtual === 'cursos' || telaAtual === 'podcasts' || telaAtual === 'biblioteca') {
      carregarConteudo(categoriaAtual)
    }
    if (telaAtual === 'vip') {
      carregarMensagensVip()
    }
  }, [telaAtual, categoriaAtual])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando AlphaFlow...</p>
        </div>
      </div>
    )
  }

  // Mostrar tela de configuração se Supabase não estiver configurado
  if (!isSupabaseConfigured && telaAtual === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlphaFlow
            </h1>
            <p className="text-gray-600 mt-2">Sua jornada para a liberdade financeira</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Configuração Necessária</h3>
            </div>
            <p className="text-orange-700 text-sm mb-3">
              Para usar todas as funcionalidades, conecte sua conta Supabase:
            </p>
            <p className="text-orange-700 text-sm font-medium">
              Configurações → Integrações → Conectar Supabase
            </p>
          </div>

          <button
            onClick={() => setTelaAtual('dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Continuar em Modo Demonstração
          </button>
        </div>
      </div>
    )
  }

  if (telaAtual === 'login' && isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AlphaFlow
            </h1>
            <p className="text-gray-600 mt-2">Sua jornada para a liberdade financeira</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const IconeCategoria = ({ categoria }: { categoria: CategoriaEnum }) => {
    const icons = {
      day_trade: TrendingUp,
      criptomoedas: Bitcoin,
      renda_passiva: PiggyBank
    }
    const Icon = icons[categoria]
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className={`min-h-screen ${tema.cores.fundo} transition-all duration-500`}>
      {/* Banner de configuração */}
      {!isSupabaseConfigured && (
        <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Modo demonstração ativo. Configure o Supabase para funcionalidades completas.
              </span>
            </div>
            <span className="text-xs text-orange-600">Configurações → Integrações</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlphaFlow
              </h1>
              <span className="text-2xl">{tema.icone}</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user ? (
                  <>
                    Olá, {user.nome}
                    {user.is_premium && <Crown className="inline w-4 h-4 text-yellow-500 ml-1" />}
                    {user.is_admin && <Settings className="inline w-4 h-4 text-red-500 ml-1" />}
                  </>
                ) : (
                  'Modo Demonstração'
                )}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setTelaAtual('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                telaAtual === 'dashboard' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setTelaAtual('cursos')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                telaAtual === 'cursos' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Play className="w-5 h-5" />
              <span>Vídeo Aulas</span>
            </button>

            <button
              onClick={() => setTelaAtual('podcasts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                telaAtual === 'podcasts' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Headphones className="w-5 h-5" />
              <span>Podcasts</span>
            </button>

            <button
              onClick={() => setTelaAtual('biblioteca')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                telaAtual === 'biblioteca' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Link className="w-5 h-5" />
              <span>Biblioteca</span>
            </button>

            <button
              onClick={() => setTelaAtual('vip')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                telaAtual === 'vip' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat VIP</span>
              {user?.is_premium && <Crown className="w-4 h-4 text-yellow-500" />}
            </button>

            {user?.is_admin && (
              <button
                onClick={() => setTelaAtual('admin')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  telaAtual === 'admin' ? `${tema.cores.botao} text-white` : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Seletor de Categoria */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Categorias
            </h3>
            <div className="space-y-2">
              {(['day_trade', 'criptomoedas', 'renda_passiva'] as CategoriaEnum[]).map((categoria) => {
                const temaCategoria = getTema(categoria)
                return (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaAtual(categoria)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      categoriaAtual === categoria 
                        ? `${temaCategoria.cores.botao} text-white` 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconeCategoria categoria={categoria} />
                    <span className="text-sm">{temaCategoria.nome}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 p-6">
          {telaAtual === 'dashboard' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Bem-vindo ao AlphaFlow! 🚀
                </h2>
                <p className="text-gray-600">
                  Sua jornada para dominar {tema.nome.toLowerCase()} começa aqui
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Play className={`w-8 h-8 ${tema.cores.texto}`} />
                    <h3 className="text-xl font-semibold text-gray-800">Vídeo Aulas</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Aprenda com especialistas através de aulas práticas e didáticas
                  </p>
                  <button
                    onClick={() => setTelaAtual('cursos')}
                    className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all`}
                  >
                    Começar Agora
                  </button>
                </div>

                <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <Headphones className={`w-8 h-8 ${tema.cores.texto}`} />
                    <h3 className="text-xl font-semibold text-gray-800">Podcasts</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Ouça conteúdos exclusivos enquanto se desloca ou relaxa
                  </p>
                  <button
                    onClick={() => setTelaAtual('podcasts')}
                    className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all`}
                  >
                    Ouvir Agora
                  </button>
                </div>

                <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageCircle className={`w-8 h-8 ${tema.cores.texto}`} />
                    <h3 className="text-xl font-semibold text-gray-800">Chat VIP</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Converse com especialistas e tire suas dúvidas em tempo real
                  </p>
                  <button
                    onClick={() => setTelaAtual('vip')}
                    className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all`}
                  >
                    {user?.is_premium ? 'Acessar Chat' : 'Assinar VIP'}
                  </button>
                </div>
              </div>

              <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Seu Progresso</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Aulas Concluídas</span>
                      <span>12/45</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${tema.cores.primaria} h-2 rounded-full`} style={{width: '27%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Podcasts Ouvidos</span>
                      <span>8/20</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`bg-gradient-to-r ${tema.cores.secundaria} h-2 rounded-full`} style={{width: '40%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {telaAtual === 'cursos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Vídeo Aulas - {tema.nome}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso: any) => (
                  <div key={curso.id} className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Play className={`w-5 h-5 ${tema.cores.texto}`} />
                      <span className="text-sm text-gray-500">{formatarDuracao(curso.duracao_minutos)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{curso.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4">{curso.descricao}</p>
                    <button className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all w-full`}>
                      Assistir Aula
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {telaAtual === 'podcasts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Podcasts - {tema.nome}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {podcasts.map((podcast: any) => (
                  <div key={podcast.id} className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Headphones className={`w-5 h-5 ${tema.cores.texto}`} />
                      <span className="text-sm text-gray-500">Podcast</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{podcast.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4">{podcast.descricao}</p>
                    <button className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all w-full`}>
                      Ouvir Podcast
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {telaAtual === 'biblioteca' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Biblioteca - {tema.nome}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bibliotecaLinks.map((link: any) => (
                  <div key={link.id} className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Link className={`w-5 h-5 ${tema.cores.texto}`} />
                      <span className="text-sm text-gray-500">YouTube</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{link.titulo}</h3>
                    <p className="text-gray-600 text-sm mb-4">{link.descricao}</p>
                    <button className={`${tema.cores.botao} text-white px-4 py-2 rounded-lg font-medium transition-all w-full`}>
                      Assistir Vídeo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {telaAtual === 'vip' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chat VIP - {tema.nome}
                </h2>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>

              {!user?.is_premium ? (
                <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center`}>
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Acesso VIP Necessário</h3>
                  <p className="text-gray-600 mb-6">
                    Converse com especialistas em {tema.nome.toLowerCase()} e tire suas dúvidas em tempo real
                  </p>
                  {!isSupabaseConfigured ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                      <p className="text-orange-700 text-sm">
                        Configure o Supabase para ativar funcionalidades VIP
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={comprarVIP}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
                    >
                      Assinar VIP - R$ 29,90/mês
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`${tema.cores.card} backdrop-blur-sm rounded-2xl p-6 shadow-lg h-96 overflow-y-auto`}>
                    {mensagensVip.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma mensagem ainda. Comece uma conversa!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mensagensVip.map((mensagem: any) => (
                          <div
                            key={mensagem.id}
                            className={`flex ${mensagem.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                mensagem.remetente === 'user'
                                  ? `${tema.cores.botao} text-white`
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{mensagem.conteudo}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(mensagem.data_criacao).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={novaMensagem}
                      onChange={(e) => setNovaMensagem(e.target.value)}
                      placeholder={`Pergunte sobre ${tema.nome.toLowerCase()}...`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && enviarMensagemVip()}
                      disabled={enviandoMensagem}
                    />
                    <button
                      onClick={enviarMensagemVip}
                      disabled={enviandoMensagem || !novaMensagem.trim()}
                      className={`${tema.cores.botao} text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50`}
                    >
                      {enviandoMensagem ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {telaAtual === 'admin' && user?.is_admin && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestão de Conteúdo</h3>
                  <p className="text-gray-600 mb-4">Adicionar, editar e gerenciar cursos, podcasts e links</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
                    Gerenciar Conteúdo
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Usuários VIP</h3>
                  <p className="text-gray-600 mb-4">Visualizar e gerenciar usuários premium</p>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-all">
                    Ver Usuários VIP
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Promover Admin</h3>
                  <p className="text-gray-600 mb-4">Conceder privilégios administrativos</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all">
                    Gerenciar Admins
                  </button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Usuários Totais</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">23</div>
                    <div className="text-sm text-gray-600">Usuários VIP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">Cursos Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-gray-600">Conteúdos Totais</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}