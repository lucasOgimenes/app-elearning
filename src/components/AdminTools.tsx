'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  Crown, 
  UserPlus, 
  Activity, 
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { User } from '@/lib/database'

interface AdminToolsProps {
  currentUser: User
}

// Mock data para demonstração
const mockUsers = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    is_premium: true,
    is_admin: false,
    nivel: 15,
    xp: 1250,
    streak_dias: 12,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    is_premium: false,
    is_admin: false,
    nivel: 8,
    xp: 680,
    streak_dias: 5,
    created_at: '2024-02-20'
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    email: 'pedro@email.com',
    is_premium: true,
    is_admin: true,
    nivel: 25,
    xp: 2800,
    streak_dias: 30,
    created_at: '2024-01-01'
  }
]

const mockStats = {
  totalUsers: 1247,
  premiumUsers: 342,
  adminUsers: 5,
  totalRevenue: 15680.50,
  monthlyGrowth: 23.5,
  activeToday: 89
}

const mockPayments = [
  {
    id: '1',
    user_name: 'João Silva',
    amount: 29.90,
    plan: 'Premium Mensal',
    status: 'completed',
    created_at: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    user_name: 'Ana Costa',
    amount: 179.90,
    plan: 'Premium Anual',
    status: 'completed',
    created_at: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    user_name: 'Carlos Lima',
    amount: 29.90,
    plan: 'Premium Mensal',
    status: 'pending',
    created_at: '2024-03-14T09:20:00Z'
  }
]

export function AdminTools({ currentUser }: AdminToolsProps) {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const promoteToAdmin = async (userId: string, userName: string) => {
    setIsLoading(true)
    
    // Simula chamada para RPC do Supabase
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_admin: true } : user
      ))
      
      toast({
        title: "Usuário Promovido! 🎉",
        description: `${userName} agora é administrador`,
        variant: "default"
      })
      
      setIsLoading(false)
    }, 1500)
  }

  const togglePremium = async (userId: string, userName: string, currentStatus: boolean) => {
    setIsLoading(true)
    
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_premium: !currentStatus } : user
      ))
      
      toast({
        title: currentStatus ? "Premium Removido" : "Premium Ativado",
        description: `Status premium de ${userName} foi ${currentStatus ? 'removido' : 'ativado'}`,
        variant: "default"
      })
      
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie usuários e monitore estatísticas</p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{mockStats.monthlyGrowth}% este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Usuários Premium</CardTitle>
              <Crown className="w-4 h-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.premiumUsers}</div>
            <p className="text-xs text-gray-600 mt-1">
              {((mockStats.premiumUsers / mockStats.totalUsers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-600 mt-1">
              {mockStats.activeToday} ativos hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
          <TabsTrigger value="payments">Histórico de Pagamentos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Busca de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.nome}</h3>
                          {user.is_premium && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {user.is_admin && (
                            <Badge variant="destructive">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Nível {user.level} • {user.xp} XP • {user.streak_dias} dias de streak
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!user.is_admin && user.id !== currentUser.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => promoteToAdmin(user.id, user.nome)}
                          disabled={isLoading}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Promover Admin
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant={user.is_premium ? "destructive" : "default"}
                        onClick={() => togglePremium(user.id, user.nome, user.is_premium)}
                        disabled={isLoading}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        {user.is_premium ? 'Remover Premium' : 'Ativar Premium'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>Últimas transações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{payment.user_name}</h3>
                      <p className="text-sm text-gray-600">{payment.plan}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        R$ {payment.amount.toFixed(2)}
                      </div>
                      <Badge 
                        variant={payment.status === 'completed' ? 'default' : 'secondary'}
                        className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {payment.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {payment.status === 'completed' ? 'Concluído' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Novos usuários hoje</span>
                    <Badge>+12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Upgrades para Premium</span>
                    <Badge>+5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cursos completados</span>
                    <Badge>+28</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessões de chat IA</span>
                    <Badge>+67</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Métricas do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de conversão</span>
                    <span className="font-medium">27.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retenção de usuários</span>
                    <span className="font-medium">84.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfação média</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo médio de uso</span>
                    <span className="font-medium">45min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}