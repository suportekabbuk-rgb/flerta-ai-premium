import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, FileText, Mic, ArrowRight } from "lucide-react";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    // Handle file drop logic here
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-2">
            Como você quer começar?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Escolha uma das opções abaixo para analisar sua conversa
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Screenshot Upload */}
          <div 
            className={`p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer hover:scale-105 ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Screenshot</h3>
              <p className="text-sm text-muted">
                Arraste um print da conversa ou clique para selecionar
              </p>
              <Badge variant="secondary" className="text-xs">
                🔒 OCR Local
              </Badge>
            </div>
          </div>

          {/* Text Input */}
          <div className="p-6 border-2 border-dashed border-border rounded-xl transition-all cursor-pointer hover:scale-105 hover:border-accent/50">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Texto Direto</h3>
              <p className="text-sm text-muted">
                Cole o texto da conversa diretamente
              </p>
              <Badge variant="outline" className="text-xs">
                ⚡ Mais Rápido
              </Badge>
            </div>
          </div>

          {/* Voice Note */}
          <div className="p-6 border-2 border-dashed border-border rounded-xl transition-all cursor-pointer hover:scale-105 hover:border-success/50">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Mic className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold">Áudio</h3>
              <p className="text-sm text-muted">
                Envie um voice note para transcrever
              </p>
              <Badge variant="outline" className="text-xs text-warning">
                🎯 Premium
              </Badge>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-background/50 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">💡 Dicas importantes:</h4>
          <ul className="text-sm text-muted space-y-1">
            <li>• Borre nomes/rostos antes de enviar (opcional)</li>
            <li>• Funciona com WhatsApp, Telegram, Instagram, Tinder...</li>
            <li>• Seus dados ficam apenas no seu dispositivo</li>
            <li>• Processamento em segundos</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button className="btn-primary flex-1 group">
            Continuar
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};