import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Infinity } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "sempre",
      description: "Ideal para testar e uso casual",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "5 análises por dia",
        "Sugestões básicas",
        "OCR local",
        "Privacidade total",
        "Contexto cultural BR"
      ],
      limitations: [
        "Sem Voice Notes",
        "Sem Anti-Catfish",
        "Sem Coach Mode"
      ],
      highlighted: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Mensal",
      price: "R$ 19,90",
      period: "por mês",
      description: "Para uso regular e resultados melhores",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Análises ilimitadas",
        "Todas as personalizações",
        "Voice Notes + TTS",
        "Anti-Catfish completo",
        "Coach Mode educativo",
        "Análise de sucesso",
        "Timing inteligente",
        "Suporte prioritário"
      ],
      limitations: [],
      highlighted: true,
      buttonText: "Assinar Agora",
      badge: "Mais Popular"
    },
    {
      name: "Anual",
      price: "R$ 199,00",
      period: "por ano",
      description: "Melhor custo-benefício. 2 meses grátis!",
      icon: <Infinity className="h-6 w-6" />,
      features: [
        "Tudo do plano Mensal",
        "2 meses GRÁTIS",
        "Acesso antecipado a recursos",
        "Backup de dados",
        "Relatórios mensais",
        "Configurações avançadas"
      ],
      limitations: [],
      highlighted: false,
      buttonText: "Economizar 17%",
      badge: "Economia"
    }
  ];

  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Preços Transparentes
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Escolha seu{" "}
            <span className="gradient-text">plano ideal</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-6">
            Preços em reais, sem pegadinhas. Cancele quando quiser.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <Check className="h-4 w-4 text-success" />
            <span>Sem cobrança de setup</span>
            <Check className="h-4 w-4 text-success ml-4" />
            <span>Cancele a qualquer momento</span>
            <Check className="h-4 w-4 text-success ml-4" />
            <span>Reembolso em 7 dias</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`surface-card relative ${
                plan.highlighted 
                  ? 'ring-2 ring-primary shadow-primary/25 scale-105' 
                  : 'hover:scale-105'
              } transition-all duration-300`}
            >
              {plan.badge && (
                <Badge 
                  className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                    plan.highlighted ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${
                    plan.highlighted ? 'bg-primary/20' : 'bg-background/50'
                  }`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted ml-1">/ {plan.period}</span>
                </div>
                
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button 
                  className={`w-full min-h-[var(--touch-target)] ${
                    plan.highlighted ? 'btn-primary' : 'btn-accent'
                  }`}
                >
                  {plan.buttonText}
                </Button>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">Incluído:</p>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <p className="font-semibold text-sm text-muted">Limitações:</p>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center gap-2">
                        <div className="h-4 w-4 flex-shrink-0 rounded-full bg-muted/50" />
                        <span className="text-sm text-muted">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optional Lifetime Plan */}
        <div className="text-center">
          <Card className="surface-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="mx-auto mb-2 bg-warning/20 text-warning">
                🎯 Oferta Especial
              </Badge>
              <CardTitle className="text-xl">Plano Vitalício</CardTitle>
              <div className="text-3xl font-bold">
                R$ 399,00
                <span className="text-base text-muted ml-2">pagamento único</span>
              </div>
              <CardDescription>
                Acesso para sempre + futuras atualizações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-accent">
                Comprar Agora
              </Button>
              <p className="text-xs text-muted text-center mt-3">
                Disponível apenas para os primeiros 1000 usuários
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};