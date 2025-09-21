import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, MessageSquare, Shield, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onUploadClick: () => void;
}

export const HeroSection = ({ onUploadClick }: HeroSectionProps) => {
  return (
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Badge */}
        <Badge variant="secondary" className="mb-6 surface-card px-4 py-2">
          <Shield className="h-4 w-4 mr-2" />
          100% Privado & LGPD Compliant
        </Badge>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Nunca mais fique sem{" "}
          <span className="gradient-text">palavras</span>
          <br />
          nas suas conversas
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
          FlertaAI analisa suas conversas e sugere respostas personalizadas que soam como{" "}
          <span className="text-accent font-semibold">você</span>. 
          Sem robozinho genérico, com total privacidade.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            onClick={onUploadClick}
            className="btn-primary group text-lg px-8 py-4 min-h-[var(--touch-target-large)]"
          >
            <Upload className="h-5 w-5 mr-2" />
            Testar Grátis Agora
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            className="text-lg px-8 py-4 min-h-[var(--touch-target-large)] bg-surface/50 hover:bg-surface"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Ver Demonstração
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>🇧🇷 Feito no Brasil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>🔒 Zero coleta de dados pessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>⚡ Resposta em segundos</span>
          </div>
        </div>
      </div>
    </section>
  );
};