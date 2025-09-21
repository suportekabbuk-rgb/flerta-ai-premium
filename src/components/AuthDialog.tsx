import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User, Shield, ArrowRight } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // Implement sign in logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    // Implement sign up logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Entrar no FlertaAI
          </DialogTitle>
          <DialogDescription className="text-center">
            Crie sua conta e comece a melhorar suas conversas
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Sua senha"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full btn-primary group"
            >
              {isLoading ? "Entrando..." : "Entrar"}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm text-muted">
                Esqueceu a senha?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Seu nome"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full btn-primary group"
            >
              {isLoading ? "Criando..." : "Criar Conta"}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-xs text-muted text-center">
              Ao criar uma conta, você concorda com nossos{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Termos de Uso
              </Button>{" "}
              e{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Política de Privacidade
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Age Verification */}
        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-warning/10 rounded-lg">
          <Shield className="h-4 w-4 text-warning" />
          <span className="text-sm text-warning">
            Apenas para maiores de 18 anos
          </span>
        </div>

        {/* LGPD Compliance */}
        <div className="text-center mt-4">
          <Badge variant="secondary" className="text-xs">
            🇧🇷 LGPD Compliant - Seus dados ficam seguros
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};