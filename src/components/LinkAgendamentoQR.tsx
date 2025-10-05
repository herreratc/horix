import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface LinkAgendamentoQRProps {
  userId: string;
  userName?: string;
}

export const LinkAgendamentoQR = ({ userId, userName }: LinkAgendamentoQRProps) => {
  const linkAgendamento = `${window.location.origin}/agendamento/${userId}`;
  
  const copiarLink = () => {
    navigator.clipboard.writeText(linkAgendamento);
    toast.success("Link copiado! 📋");
  };

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Agende comigo - ${userName || 'Agendamento'}`,
          text: 'Agende seu horário de forma rápida e fácil!',
          url: linkAgendamento,
        });
        toast.success("Compartilhado com sucesso!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      copiarLink();
      toast.info("Use o botão Copiar para compartilhar o link");
    }
  };

  const baixarQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'qrcode-agendamento.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("QR Code baixado!");
        }
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const abrirLink = () => {
    window.open(linkAgendamento, '_blank');
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Link de Agendamento
        </CardTitle>
        <CardDescription>
          Compartilhe este link ou QR code com seus clientes para que possam agendar online
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-border">
            <QRCodeSVG
              id="qr-code-svg"
              value={linkAgendamento}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#000000"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={baixarQRCode}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar QR Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={compartilhar}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Link Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Ou copie o link direto:</Label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm truncate border">
              {linkAgendamento}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copiarLink}
              title="Copiar link"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={abrirLink}
              title="Abrir link"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm text-foreground">💡 Dicas de uso:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Adicione o QR code em seus materiais impressos</li>
            <li>• Compartilhe o link nas redes sociais</li>
            <li>• Use o QR code em sua vitrine ou recepção</li>
            <li>• Envie o link direto para seus clientes via WhatsApp</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
