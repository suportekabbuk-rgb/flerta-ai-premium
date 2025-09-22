import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingData {
  name: string;
  timezone: string;
  humor: number;       // 0-100
  subtlety: number;    // 0-100  
  boldness: number;    // 0-100
  messageLength: 'short' | 'medium' | 'long';
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    timezone: 'America/Sao_Paulo',
    humor: 70,
    subtlety: 60,
    boldness: 50,
    messageLength: 'medium'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Save preferences to profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          tone: {
            humor: data.humor,
            subtlety: data.subtlety,
            boldness: data.boldness,
            messageLength: data.messageLength
          },
          tz: data.timezone,
          locale: 'pt-BR'
        });

      if (error) throw error;

      toast({
        title: "Configuração concluída! 🎉",
        description: "Agora você pode começar a usar o FlertaAI.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao salvar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo ao FlertaAI!</h2>
              <p className="text-muted">Vamos configurar seu perfil para sugestões personalizadas</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Como você gostaria de ser chamado?</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Seu nome ou apelido"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="timezone">Seu fuso horário</Label>
                <Select value={data.timezone} onValueChange={(value) => setData({ ...data, timezone: value })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/Rio_Branco">Rio Branco (GMT-5)</SelectItem>
                    <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                    <SelectItem value="America/Fortaleza">Fortaleza (GMT-3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Seu Estilo de Conversa</h2>
              <p className="text-muted">Ajuste os deslizadores conforme sua personalidade</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Humor</Label>
                <p className="text-sm text-muted mt-1">Quanto humor você gosta de usar?</p>
                <div className="mt-3">
                  <Slider
                    value={[data.humor]}
                    onValueChange={([value]) => setData({ ...data, humor: value })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>Sério</span>
                    <span>{data.humor}%</span>
                    <span>Divertido</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Sutileza</Label>
                <p className="text-sm text-muted mt-1">Prefere ser direto ou sutil?</p>
                <div className="mt-3">
                  <Slider
                    value={[data.subtlety]}
                    onValueChange={([value]) => setData({ ...data, subtlety: value })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>Direto</span>
                    <span>{data.subtlety}%</span>
                    <span>Sutil</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Ousadia</Label>
                <p className="text-sm text-muted mt-1">Qual seu nível de ousadia no flerte?</p>
                <div className="mt-3">
                  <Slider
                    value={[data.boldness]}
                    onValueChange={([value]) => setData({ ...data, boldness: value })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted mt-2">
                    <span>Tímido</span>
                    <span>{data.boldness}%</span>
                    <span>Ousado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Preferências Finais</h2>
              <p className="text-muted">Como você prefere suas mensagens?</p>
            </div>

            <div>
              <Label className="text-base font-medium">Comprimento das mensagens</Label>
              <p className="text-sm text-muted mt-1">Estilo de resposta preferido</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: 'short', label: 'Curtas', desc: '1-2 linhas' },
                  { value: 'medium', label: 'Médias', desc: '2-3 linhas' },
                  { value: 'long', label: 'Longas', desc: '3+ linhas' }
                ].map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      data.messageLength === option.value 
                        ? 'ring-2 ring-primary bg-primary/10' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setData({ ...data, messageLength: option.value as any })}
                  >
                    <CardContent className="p-4 text-center">
                      <h3 className="font-medium text-foreground">{option.label}</h3>
                      <p className="text-xs text-muted mt-1">{option.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-surface/50 rounded-lg p-4 border border-border/30">
              <h3 className="font-medium text-foreground mb-3">Resumo do seu perfil:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Humor:</span>
                  <span className="text-foreground">{data.humor}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sutileza:</span>
                  <span className="text-foreground">{data.subtlety}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Ousadia:</span>
                  <span className="text-foreground">{data.boldness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Mensagens:</span>
                  <span className="text-foreground capitalize">{data.messageLength}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0;
      case 2:
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <header className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted">Passo {step} de 3</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-6">
        <Card className="surface-card max-w-md mx-auto">
          <CardHeader>
            <CardContent className="p-6">
              {getCurrentStepContent()}
            </CardContent>
          </CardHeader>
        </Card>
      </main>

      {/* Bottom Actions */}
      <div className="px-4 pb-6 safe-area-inset-bottom">
        <div className="max-w-md mx-auto space-y-3">
          <Button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            className="w-full btn-primary"
            size="lg"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                {step === 3 ? 'Finalizar' : 'Continuar'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {step > 1 && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full"
              disabled={loading}
            >
              Voltar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}