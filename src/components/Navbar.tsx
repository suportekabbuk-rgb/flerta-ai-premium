import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onAuthClick: () => void;
}

export const Navbar = ({ onAuthClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-border/30">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold gradient-text">FlertaAI</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              BETA
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-muted hover:text-primary transition-colors">
              Preços
            </a>
            <a href="#privacy" className="text-muted hover:text-primary transition-colors">
              Privacidade
            </a>
            <Button variant="outline" onClick={onAuthClick} className="min-h-[var(--touch-target)]">
              Entrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden min-h-[var(--touch-target)] min-w-[var(--touch-target)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border/30">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-muted hover:text-primary transition-colors py-2">
                Recursos
              </a>
              <a href="#pricing" className="text-muted hover:text-primary transition-colors py-2">
                Preços
              </a>
              <a href="#privacy" className="text-muted hover:text-primary transition-colors py-2">
                Privacidade
              </a>
              <Button onClick={onAuthClick} className="btn-primary mt-2">
                Entrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};