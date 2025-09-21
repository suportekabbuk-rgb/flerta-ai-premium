import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Scan, 
  MessageCircle, 
  Volume2, 
  Shield, 
  Target, 
  Award,
  Clock,
  Globe,
  Trash2
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Scan className="h-8 w-8 text-primary" />,
      title: "OCR Inteligente",
      description: "Escaneie prints de conversas ou cole texto direto. Reconhece automaticamente quem falou o quê.",
      badge: "IA Avançada"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-accent" />,
      title: "Sugestões Personalizadas",
      description: "Respostas que combinam com seu jeito de falar. Configurável por tom, comprimento e estilo.",
      badge: "Sua Voz"
    },
    {
      icon: <Volume2 className="h-8 w-8 text-success" />,
      title: "Voice Notes",
      description: "Transcrição de áudios recebidos e TTS para suas respostas. Ideal para WhatsApp e Telegram.",
      badge: "Áudio IA"
    },
    {
      icon: <Target className="h-8 w-8 text-warning" />,
      title: "Contexto Cultural BR",
      description: "Entende gírias brasileiras, timing de mensagens e contexto cultural. Evita clichês óbvios.",
      badge: "🇧🇷 BR"
    },
    {
      icon: <Award className="h-8 w-8 text-primary-light" />,
      title: "Análise de Sucesso",
      description: "Acompanhe quais respostas funcionam melhor. Sistema de feedback para melhoria contínua.",
      badge: "Analytics"
    },
    {
      icon: <Shield className="h-8 w-8 text-destructive" />,
      title: "Anti-Catfish",
      description: "Verificação de autenticidade de fotos enviadas. Detecta imagens falsas ou roubadas.",
      badge: "Segurança"
    },
    {
      icon: <Clock className="h-8 w-8 text-muted" />,
      title: "Timing Inteligente",
      description: "Sugere horários adequados para enviar mensagens baseado no fuso horário brasileiro.",
      badge: "Smart Time"
    },
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Coach Mode",
      description: "Modo treinador explica o 'porquê' das sugestões e oferece alternativas educativas.",
      badge: "Educativo"
    },
    {
      icon: <Trash2 className="h-8 w-8 text-warning" />,
      title: "Excluir Tudo",
      description: "Botão de remoção completa dos dados. Total conformidade LGPD com logs auditáveis.",
      badge: "LGPD"
    }
  ];

  return (
    <section id="features" className="py-16 px-4 bg-surface/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Recursos Únicos
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Muito mais que um{" "}
            <span className="gradient-text">gerador de texto</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            FlertaAI foi desenvolvido especificamente para brasileiros, 
            com recursos que nenhum concorrente oferece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="surface-card hover:scale-105 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-background/50 rounded-lg group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted mb-4">
            Pronto para revolucionar suas conversas?
          </p>
          <Badge variant="secondary" className="pulse-glow">
            ⚡ Teste grátis sem precisar de cartão
          </Badge>
        </div>
      </div>
    </section>
  );
};