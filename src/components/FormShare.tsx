import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download, QrCode, Share2, Check, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';

interface FormShareProps {
  formId: string;
  formTitle: string;
}

export function FormShare({ formId, formTitle }: FormShareProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [publicUrl, setPublicUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [formId]);

  const generateQRCode = async () => {
    const url = `${window.location.origin}/forms/${formId}/view`;
    setPublicUrl(url);

    try {
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      setQrCodeDataURL(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "The form URL has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `${formTitle.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Saved",
      description: "The QR code image has been downloaded.",
    });
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fill out: ${formTitle}`,
          text: `I'd love your response on this form: ${formTitle}`,
          url: publicUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
        <AnimatePresence mode="wait">
          {qrCodeDataURL ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-white rounded-xl shadow-sm border border-slate-100"
            >
              <img
                src={qrCodeDataURL}
                alt={`QR code for ${formTitle}`}
                className="w-48 h-48 object-contain"
              />
            </motion.div>
          ) : (
            <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-xl" />
          )}
        </AnimatePresence>
        <div className="flex gap-2 w-full justify-center">
          <Button variant="outline" size="sm" onClick={downloadQRCode} className="w-1/2">
            <Download className="h-4 w-4 mr-2" />
            Save Image
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">Public Form URL</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={publicUrl}
              readOnly
              className="pr-10 bg-slate-50 border-slate-200 text-slate-600 font-mono text-sm"
            />
          </div>
          <Button onClick={copyToClipboard} className={`${copied ? 'bg-green-600 hover:bg-green-700' : ''} min-w-[100px] transition-all`}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center pt-2">
          <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900">
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Test Link
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={shareNative} className="text-slate-500 hover:text-slate-900">
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Share via...
          </Button>
        </div>
      </div>
    </div>
  );
}
