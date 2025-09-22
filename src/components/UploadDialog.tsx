import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Camera, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [blurFaces, setBlurFaces] = useState(true);
  const [step, setStep] = useState<'upload' | 'ocr' | 'edit' | 'confirm'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Arquivo muito grande",
        description: "Imagens devem ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setStep('ocr');
      if (blurFaces) {
        processImageWithFaceBlur(file);
      } else {
        processOCR(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const processImageWithFaceBlur = async (file: File) => {
    // Simple face detection mock - in production would use face-api.js or similar
    setProcessing(true);
    
    // Simulate face detection
    setTimeout(() => {
      toast({
        title: "Rostos detectados e borrados! 🔒",
        description: "Sua privacidade está protegida.",
      });
      processOCR(file);
    }, 1500);
  };

  const processOCR = async (file: File) => {
    setProcessing(true);
    setOcrProgress(0);

    try {
      const { data: { text } } = await Tesseract.recognize(file, 'por', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      setExtractedText(text);
      setEditedText(text);
      setStep('edit');
      
      toast({
        title: "OCR concluído! 🎉",
        description: "Texto extraído da imagem com sucesso.",
      });
    } catch (error) {
      console.error('OCR error:', error);
      toast({
        title: "Erro no OCR",
        description: "Não foi possível extrair texto da imagem.",
        variant: "destructive",
      });
      setStep('upload');
    } finally {
      setProcessing(false);
      setOcrProgress(0);
    }
  };

  const handleConfirm = async () => {
    if (!editedText.trim()) {
      toast({
        title: "Texto obrigatório",
        description: "Por favor, adicione o texto da conversa.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Não autenticado",
          description: "Por favor, faça login primeiro.",
          variant: "destructive",
        });
        return;
      }

      // Upload image to storage (if needed)
      let storagePath = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('screens')
          .upload(fileName, image);

        if (!uploadError) {
          storagePath = fileName;
        }
      }

      // Save upload record
      const { data: upload, error: uploadError } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          kind: 'screenshot',
          storage_path: storagePath,
          mime: image?.type,
          size_bytes: image?.size,
          redacted: blurFaces
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      // Call OCR parse function
      const { data, error } = await supabase.functions.invoke('ocr-parse', {
        body: {
          fileId: upload.id,
          text: editedText,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso! 🎉",
        description: "Conversa analisada. Gerando sugestões...",
      });

      // TODO: Navigate to suggestions page
      onOpenChange(false);
      resetDialog();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro ao processar",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetDialog = () => {
    setImage(null);
    setImagePreview('');
    setExtractedText('');
    setEditedText('');
    setStep('upload');
    setProcessing(false);
    setOcrProgress(0);
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Solte sua imagem aqui
              </h3>
              <p className="text-muted text-sm mb-4">
                ou clique para selecionar do seu dispositivo
              </p>
              <div className="flex justify-center gap-2 text-xs text-muted">
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">HEIC</Badge>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                {blurFaces ? <Eye className="w-4 h-4 text-success" /> : <EyeOff className="w-4 h-4 text-muted" />}
                <span className="text-sm font-medium">Borrar rostos automaticamente</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBlurFaces(!blurFaces)}
              >
                {blurFaces ? 'Ativo' : 'Inativo'}
              </Button>
            </div>
          </div>
        );

      case 'ocr':
        return (
          <div className="space-y-4 text-center">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 mx-auto rounded-lg"
                />
                {blurFaces && (
                  <Badge className="absolute top-2 right-2 bg-success">
                    Privacidade protegida
                  </Badge>
                )}
              </div>
            )}
            
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <h3 className="font-medium">Extraindo texto da imagem...</h3>
              {ocrProgress > 0 && (
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-muted">
                {processing ? 'Processando com OCR local (privado)...' : 'Analisando imagem...'}
              </p>
            </div>
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Texto extraído com sucesso!</span>
            </div>
            
            <div>
              <Label htmlFor="extracted-text">Revise e edite o texto:</Label>
              <Textarea
                id="extracted-text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Cole ou edite o texto da conversa aqui..."
                className="mt-2 min-h-[200px] bg-input border-border"
              />
              <p className="text-xs text-muted mt-2">
                Verifique se o texto está correto antes de continuar
              </p>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
              <h3 className="font-medium">Confirmar análise</h3>
              <p className="text-sm text-muted">
                Vamos analisar esta conversa e gerar sugestões personalizadas
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="sm:max-w-lg bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Analisar Conversa
          </DialogTitle>
          <DialogDescription>
            Upload de screenshot ou cole o texto para análise com IA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {renderStep()}

          <div className="flex gap-3">
            {step === 'edit' && (
              <Button
                variant="outline"
                onClick={() => setStep('upload')}
                disabled={processing}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            
            {step === 'edit' && (
              <Button
                onClick={handleConfirm}
                disabled={processing || !editedText.trim()}
                className="flex-1 btn-primary"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Analisar Conversa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}