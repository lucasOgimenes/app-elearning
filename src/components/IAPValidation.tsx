'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Crown, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface IAPValidationProps {
  userId: string
  onSuccess: () => void
}

export function IAPValidation({ userId, onSuccess }: IAPValidationProps) {
  const [receipt, setReceipt] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null)
  const { toast } = useToast()

  const simulateIAPValidation = async () => {
    if (!receipt.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um recibo válido",
        variant: "destructive"
      })
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    // Simula validação do recibo (2-3 segundos)
    setTimeout(() => {
      // Simula sucesso se o recibo contém certas palavras
      const isValid = receipt.toLowerCase().includes('premium') || 
                     receipt.toLowerCase().includes('vip') ||
                     receipt.toLowerCase().includes('alphaflow') ||
                     receipt.length > 10

      if (isValid) {
        setValidationResult('success')
        toast({
          title: "Compra Validada! 🎉",
          description: "Seu acesso premium foi ativado com sucesso",
          variant: "default"
        })
        
        // Simula atualização no banco
        console.log(`Usuário ${userId} promovido para Premium`)
        
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        setValidationResult('error')
        toast({
          title: "Erro na Validação",
          description: "Recibo inválido. Verifique os dados e tente novamente",
          variant: "destructive"
        })
      }
      
      setIsValidating(false)
    }, 2000 + Math.random() * 1000)
  }

  const simulateQuickPurchase = () => {
    setReceipt('ALPHAFLOW_PREMIUM_' + Date.now())
    setTimeout(() => {
      simulateIAPValidation()
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Planos Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-yellow-800">Premium Mensal</CardTitle>
            <CardDescription>Acesso completo por 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-yellow-800 mb-2">R$ 29,90</div>
            <p className="text-sm text-yellow-700 mb-4">por mês</p>
            <Button 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              onClick={simulateQuickPurchase}
              disabled={isValidating}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar Agora
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-purple-800">Premium Anual</CardTitle>
            <CardDescription>Melhor valor - 12 meses</CardDescription>
            <Badge className="bg-green-100 text-green-800 mt-2">
              Economize 40%
            </Badge>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-purple-800 mb-2">R$ 179,90</div>
            <p className="text-sm text-purple-700 mb-1">por ano</p>
            <p className="text-xs text-gray-600 mb-4">R$ 14,99/mês</p>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
              onClick={simulateQuickPurchase}
              disabled={isValidating}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Assinar Agora
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Validação Manual de Recibo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Já fez a compra? Valide seu recibo
          </CardTitle>
          <CardDescription>
            Cole aqui o recibo da sua compra para ativar o premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="receipt">Recibo de Compra</Label>
            <Input
              id="receipt"
              value={receipt}
              onChange={(e) => setReceipt(e.target.value)}
              placeholder="Cole seu recibo aqui... (ex: ALPHAFLOW_PREMIUM_123456)"
              disabled={isValidating}
            />
          </div>

          <Button 
            onClick={simulateIAPValidation}
            disabled={!receipt.trim() || isValidating}
            className="w-full"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Validar Compra
              </>
            )}
          </Button>

          {/* Resultado da Validação */}
          {validationResult === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Compra validada com sucesso!</p>
                <p className="text-sm text-green-700">Seu acesso premium está sendo ativado...</p>
              </div>
            </div>
          )}

          {validationResult === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Erro na validação</p>
                <p className="text-sm text-red-700">Verifique o recibo e tente novamente</p>
              </div>
            </div>
          )}

          {/* Dica para Demonstração */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica para demonstração:</strong> Use qualquer texto que contenha "premium", "vip" ou "alphaflow" para simular uma compra válida.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}