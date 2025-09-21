import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Upload, Shield, Zap, Heart, Award } from "lucide-react";
import { UploadDialog } from "@/components/UploadDialog";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { AuthDialog } from "@/components/AuthDialog";

const Index = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => setShowAuth(true)} />
      
      {/* Hero Section */}
      <HeroSection onUploadClick={() => setShowUpload(true)} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="bg-surface/80 backdrop-blur-lg border-t border-border/30 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold gradient-text">FlertaAI</span>
          </div>
          <p className="text-muted mb-4">
            Assistente de conversas inteligente. Privacidade em primeiro lugar.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">LGPD</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
          </div>
          <div className="mt-6 text-xs text-muted">
            © 2024 FlertaAI. Todos os direitos reservados. Feito com ❤️ no Brasil.
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <UploadDialog open={showUpload} onOpenChange={setShowUpload} />
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
};

export default Index;