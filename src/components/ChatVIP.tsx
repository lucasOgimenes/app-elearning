'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  Bitcoin, 
  PiggyBank,
  MessageCircle,
  Sparkles
} from 'lucide-react'

type Categoria = 'day_trade' | 'criptomoedas' | 'renda_passiva'

interface Mensagem {
  id: string
  remetente: 'user' | 'ia'
  conteudo: string
  timestamp: Date
  categoria: Categoria
}

interface ChatVIPProps {
  userId: string
  categoria: Categoria
  isConnected: boolean
}

// Agente de IA Local - Base de conhecimento por categoria
const conhecimentoIA = {
  day_trade: {
    saudacao: "Olá! Sou seu especialista em Day Trade. Posso te ajudar com análise técnica, estratégias de entrada e saída, gerenciamento de risco e muito mais!",
    respostas: {
      'análise técnica': "A análise técnica é fundamental no day trade. Foque em indicadores como RSI, MACD, Bandas de Bollinger e médias móveis. O volume também é crucial para confirmar movimentos.",
      'gerenciamento de risco': "No day trade, nunca arrisque mais de 1-2% do seu capital por operação. Use stop loss sempre e mantenha uma relação risco/retorno de pelo menos 1:2.",
      'estratégias': "Algumas estratégias eficazes: scalping em ações líquidas, breakout de suportes/resistências, e trading de reversão em níveis importantes. Sempre teste em conta demo primeiro.",
      'horários': "Os melhores horários para day trade no Brasil são: abertura (10h-11h) e fechamento (16h30-17h30). Evite o meio do dia quando o volume diminui.",
      'psicologia': "A psicologia é 80% do sucesso. Mantenha disciplina, não opere por emoção, aceite perdas pequenas e nunca persiga prejuízos com posições maiores."
    }
  },
  criptomoedas: {
    saudacao: "Oi! Sou seu especialista em Criptomoedas. Posso te orientar sobre Bitcoin, altcoins, DeFi, análise on-chain e estratégias de investimento crypto!",
    respostas: {
      'bitcoin': "Bitcoin é o ouro digital. Para investir, considere DCA (Dollar Cost Average), analise ciclos de halving e acompanhe métricas como Fear & Greed Index e dominância BTC.",
      'altcoins': "Altcoins têm maior potencial de retorno mas também maior risco. Foque em projetos com utilidade real, equipe forte e comunidade ativa. Diversifique sempre.",
      'defi': "DeFi oferece oportunidades de yield farming e staking. Cuidado com riscos de smart contracts e impermanent loss. Comece com protocolos estabelecidos como Uniswap e Aave.",
      'análise on-chain': "Métricas importantes: MVRV ratio, NVT ratio, exchange inflows/outflows, e endereços ativos. Use ferramentas como Glassnode e CryptoQuant.",
      'segurança': "Nunca deixe grandes quantias em exchanges. Use hardware wallets, ative 2FA, cuidado com phishing e sempre verifique endereços antes de transferir."
    }
  },
  renda_passiva: {
    saudacao: "Olá! Sou seu especialista em Renda Passiva. Vou te ajudar com investimentos, dividendos, REITs, renda fixa e estratégias para construir patrimônio!",
    respostas: {
      'dividendos': "Foque em empresas com histórico consistente de pagamento, payout sustentável (40-60%) e crescimento do negócio. Diversifique entre setores defensivos.",
      'reits': "REITs são excelentes para renda passiva. Analise vacancy rate, FFO, dividend yield e qualidade dos imóveis. Diversifique entre tipos: logístico, corporativo, residencial.",
      'renda fixa': "Para renda passiva, considere: Tesouro IPCA+ para longo prazo, CDBs de bancos médios, LCIs/LCAs isentas de IR e debêntures incentivadas.",
      'estratégias': "Estratégia barbell: combine alta segurança (80% renda fixa) com alto potencial (20% ações/REITs). Reinvista dividendos para acelerar o crescimento.",
      'planejamento': "Defina sua meta de renda mensal, calcule o patrimônio necessário (meta ÷ yield médio), e invista consistentemente. Paciência é fundamental."
    }
  }
}

// Função do Agente de IA Local
const gerarRespostaIA = (mensagem: string, categoria: Categoria): string => {
  const conhecimento = conhecimentoIA[categoria]
  const mensagemLower = mensagem.toLowerCase()
  
  // Busca por palavras-chave na mensagem
  for (const [palavra, resposta] of Object.entries(conhecimento.respostas)) {
    if (mensagemLower.includes(palavra)) {
      return resposta
    }
  }
  
  // Respostas genéricas baseadas em palavras-chave comuns
  if (mensagemLower.includes('como') || mensagemLower.includes('o que')) {
    const respostasGenericas = [
      `Ótima pergunta sobre ${categoria.replace('_', ' ')}! Baseado na sua dúvida, recomendo focar nos fundamentos primeiro.`,
      `Para ${categoria.replace('_', ' ')}, é importante entender os conceitos básicos antes de partir para estratégias avançadas.`,
      `Essa é uma área complexa em ${categoria.replace('_', ' ')}. Vou te dar uma orientação prática...`
    ]
    return respostasGenericas[Math.floor(Math.random() * respostasGenericas.length)]
  }
  
  if (mensagemLower.includes('obrigado') || mensagemLower.includes('valeu')) {
    return "Por nada! Estou aqui para te ajudar a evoluir em seus investimentos. Tem mais alguma dúvida?"
  }
  
  if (mensagemLower.includes('olá') || mensagemLower.includes('oi')) {
    return conhecimento.saudacao
  }
  
  // Resposta padrão
  const respostasDefault = [
    `Interessante pergunta sobre ${categoria.replace('_', ' ')}! Pode ser mais específico para eu te dar uma orientação mais precisa?`,
    `Para te ajudar melhor com ${categoria.replace('_', ' ')}, preciso entender melhor seu contexto. Pode detalhar sua situação?`,
    `Essa área de ${categoria.replace('_', ' ')} tem muitas nuances. Que aspecto específico te interessa mais?`
  ]
  
  return respostasDefault[Math.floor(Math.random() * respostasDefault.length)]
}

export function ChatVIP({ userId, categoria, isConnected }: ChatVIPProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const categoriaInfo = {
    day_trade: { nome: 'Day Trade', icon: TrendingUp, cor: 'text-red-600' },
    criptomoedas: { nome: 'Criptomoedas', icon: Bitcoin, cor: 'text-blue-600' },
    renda_passiva: { nome: 'Renda Passiva', icon: PiggyBank, cor: 'text-green-600' }
  }

  useEffect(() => {
    // Mensagem de boas-vindas quando muda categoria
    const mensagemBoasVindas: Mensagem = {
      id: `welcome-${categoria}-${Date.now()}`,
      remetente: 'ia',
      conteudo: conhecimentoIA[categoria].saudacao,
      timestamp: new Date(),
      categoria
    }
    
    setMensagens([mensagemBoasVindas])
  }, [categoria])

  useEffect(() => {
    // Auto-scroll para última mensagem
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [mensagens])

  const enviarMensagem = async () => {
    if (!novaMensagem.trim()) return
    
    const mensagemUser: Mensagem = {
      id: `user-${Date.now()}`,
      remetente: 'user',
      conteudo: novaMensagem,
      timestamp: new Date(),
      categoria
    }
    
    setMensagens(prev => [...prev, mensagemUser])
    setNovaMensagem('')
    setIsLoading(true)
    
    // Simula delay de processamento da IA
    setTimeout(() => {
      const respostaIA = gerarRespostaIA(novaMensagem, categoria)
      
      const mensagemIA: Mensagem = {
        id: `ia-${Date.now()}`,
        remetente: 'ia',
        conteudo: respostaIA,
        timestamp: new Date(),
        categoria
      }
      
      setMensagens(prev => [...prev, mensagemIA])
      setIsLoading(false)
      
      // Salvar no Supabase se conectado (simulado)
      if (isConnected) {
        // Aqui seria a chamada real para salvar no Supabase
        console.log('Salvando mensagens no Supabase:', [mensagemUser, mensagemIA])
      }
    }, 1000 + Math.random() * 1000) // Delay realista de 1-2 segundos
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviarMensagem()
    }
  }

  const Icon = categoriaInfo[categoria].icon

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              Especialista IA - {categoriaInfo[categoria].nome}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {isConnected ? 'Conectado • Mensagens salvas' : 'Modo demonstração • Mensagens não salvas'}
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Bot className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de Mensagens - Substituindo ScrollArea por div com overflow */}
        <div 
          className="flex-1 px-4 overflow-y-auto max-h-[400px]" 
          ref={scrollAreaRef}
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="space-y-4 pb-4">
            {mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                className={`flex gap-3 ${mensagem.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {mensagem.remetente === 'ia' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${mensagem.remetente === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      mensagem.remetente === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-1">
                    {mensagem.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {mensagem.remetente === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input de Mensagem */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Pergunte sobre ${categoriaInfo[categoria].nome.toLowerCase()}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={enviarMensagem} 
              disabled={!novaMensagem.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {!isConnected && (
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Conecte o Supabase para salvar histórico de conversas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}