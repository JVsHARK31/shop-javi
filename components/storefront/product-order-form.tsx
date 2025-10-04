'use client';

import { useState } from 'react';
import { Product, ProductVariation, WhatsAppOrderData } from '@/lib/types';
import { formatRupiahShort, formatWhatsAppMessage, generateWhatsAppUrl, copyToClipboard } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, MessageCircle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProductOrderFormProps {
  product: Product;
}

const WHATSAPP_NUMBER = '6288290286954';

export function ProductOrderForm({ product }: ProductOrderFormProps) {
  const variations = product.variations || [];
  const defaultVariation = variations.find(v => v.is_default) || variations[0];

  const [selectedVariationId, setSelectedVariationId] = useState<string>(
    defaultVariation?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const selectedVariation = variations.find(v => v.id === selectedVariationId);
  const isOutOfStock = !selectedVariation || selectedVariation.stok === 0;
  const totalPrice = selectedVariation ? selectedVariation.price * quantity : 0;
  const maxQuantity = selectedVariation ? selectedVariation.stok : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleVariationChange = (variationId: string) => {
    setSelectedVariationId(variationId);
    setQuantity(1);
  };

  const handleOrderClick = async () => {
    if (!selectedVariation) return;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const orderData: WhatsAppOrderData = {
      namaProduk: product.judul,
      namaVariasi: selectedVariation.nama_variasi,
      qty: quantity,
      totalHarga: totalPrice,
      urlProduk: currentUrl,
    };

    const message = formatWhatsAppMessage(orderData);
    const whatsappUrl = generateWhatsAppUrl(WHATSAPP_NUMBER, message);

    try {
      await copyToClipboard(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success('Ringkasan pesanan disalin!', {
        description: 'WhatsApp akan terbuka di tab baru',
      });

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error:', error);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (variations.length === 0) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-4 text-center text-muted-foreground">
          Produk ini belum memiliki variasi yang tersedia
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5 md:p-6">
        <div>
          <Label htmlFor="variation" className="text-sm sm:text-base">Pilih Variasi</Label>
          <Select
            value={selectedVariationId}
            onValueChange={handleVariationChange}
          >
            <SelectTrigger id="variation" className="mt-2 h-10 sm:h-11">
              <SelectValue placeholder="Pilih variasi" />
            </SelectTrigger>
            <SelectContent>
              {variations.map((variation) => (
                <SelectItem key={variation.id} value={variation.id || ''} className="text-sm">
                  <span className="block sm:inline">{variation.nama_variasi}</span>
                  <span className="block sm:inline sm:ml-1">- {formatRupiahShort(variation.price)}</span>
                  {variation.stok === 0 && <span className="block sm:inline text-destructive"> (Stok Habis)</span>}
                  {variation.stok > 0 && variation.stok <= 5 && <span className="block sm:inline text-orange-600"> (Sisa {variation.stok})</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedVariation && (
          <>
            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Harga</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatRupiahShort(selectedVariation.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-muted-foreground">Stok Tersedia</p>
                <p className={`text-sm sm:text-base font-semibold ${isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Habis' : `${selectedVariation.stok} unit`}
                </p>
              </div>
            </div>

            {!isOutOfStock && (
              <div>
                <Label htmlFor="quantity" className="text-sm sm:text-base">Jumlah</Label>
                <div className="mt-2 flex items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1 && val <= maxQuantity) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 sm:w-20 rounded-md border border-input px-2 sm:px-3 py-2 text-center text-sm sm:text-base"
                    min={1}
                    max={maxQuantity}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQuantity}
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {!isOutOfStock && (
              <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm sm:text-base font-semibold">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  {formatRupiahShort(totalPrice)}
                </p>
              </div>
            )}
          </>
        )}

        <Button
          onClick={handleOrderClick}
          disabled={isOutOfStock || !selectedVariation}
          className="w-full bg-green-600 hover:bg-green-700 h-11 sm:h-12"
          size="lg"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Disalin!</span>
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">{isOutOfStock ? 'Stok Habis' : 'Pesan via WhatsApp'}</span>
            </>
          )}
        </Button>

        {!isOutOfStock && (
          <p className="text-xs sm:text-sm text-center text-muted-foreground leading-relaxed">
            Klik tombol di atas untuk melanjutkan pemesanan via WhatsApp
          </p>
        )}
      </CardContent>
    </Card>
  );
}
