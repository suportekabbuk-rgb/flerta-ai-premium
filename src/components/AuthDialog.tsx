import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, ArrowRight, Shield, Zap } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const { toast } = useToast();

  const handleEmailAuth = async () => {
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "Link enviado! 📧",
        description: "Verifique seu email para fazer login.",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            FlertaAI
          </DialogTitle>
          <DialogDescription className="text-muted">
            {mode === 'signup' 
              ? 'Crie sua conta e comece a flertar melhor!'
              : 'Entre na sua conta para continuar'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            <TabsTrigger value="signin">Entrar</TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted mb-4">
              <div className="flex flex-col items-center gap-1">
                <Shield className="w-4 h-4 text-success" />
                <span>100% Privado</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-warning" />
                <span>OCR Local</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Mail className="w-4 h-4 text-primary" />
                <span>LGPD</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signin" className="space-y-4">
            <p className="text-sm text-muted text-center">
              Bem-vindo de volta! Entre para continuar melhorando suas conversas.
            </p>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          {/* Email Magic Link */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email para magic link
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-input border-border"
              />
              <Button
                onClick={handleEmailAuth}
                disabled={loading || !email.trim()}
                className="w-full btn-primary"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Link Mágico
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Google OAuth */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-muted">ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </Button>

          <p className="text-xs text-muted text-center">
            Ao criar conta, você concorda com nossos{' '}
            <a href="#" className="text-primary hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}