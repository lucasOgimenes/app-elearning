import { CategoriaEnum } from './supabase'

export const temas = {
  day_trade: {
    nome: 'Day Trade',
    cores: {
      primaria: 'from-red-600 to-red-800',
      secundaria: 'from-yellow-500 to-yellow-600',
      fundo: 'bg-gradient-to-br from-red-50 to-yellow-50',
      fundoEscuro: 'bg-gradient-to-br from-red-950 to-yellow-950',
      texto: 'text-red-800',
      textoEscuro: 'text-red-200',
      botao: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      card: 'bg-white/80 border-red-200',
      cardEscuro: 'bg-red-900/20 border-red-800',
    },
    icone: '📈',
    descricao: 'Velocidade, risco e oportunidades no mercado'
  },
  criptomoedas: {
    nome: 'Criptomoedas',
    cores: {
      primaria: 'from-blue-600 to-purple-600',
      secundaria: 'from-cyan-500 to-blue-500',
      fundo: 'bg-gradient-to-br from-blue-50 to-purple-50',
      fundoEscuro: 'bg-gradient-to-br from-blue-950 to-purple-950',
      texto: 'text-blue-800',
      textoEscuro: 'text-blue-200',
      botao: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
      card: 'bg-white/80 border-blue-200',
      cardEscuro: 'bg-blue-900/20 border-blue-800',
    },
    icone: '₿',
    descricao: 'Tecnologia, inovação e o futuro das finanças'
  },
  renda_passiva: {
    nome: 'Renda Passiva',
    cores: {
      primaria: 'from-green-600 to-emerald-600',
      secundaria: 'from-teal-500 to-green-500',
      fundo: 'bg-gradient-to-br from-green-50 to-emerald-50',
      fundoEscuro: 'bg-gradient-to-br from-green-950 to-emerald-950',
      texto: 'text-green-800',
      textoEscuro: 'text-green-200',
      botao: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
      card: 'bg-white/80 border-green-200',
      cardEscuro: 'bg-green-900/20 border-green-800',
    },
    icone: '🌱',
    descricao: 'Estabilidade, crescimento e liberdade financeira'
  }
}

export const getTema = (categoria: CategoriaEnum) => {
  return temas[categoria]
}

export const formatarDuracao = (minutos: number): string => {
  if (minutos < 60) {
    return `${minutos}min`
  }
  const horas = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60
  return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`
}

export const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}