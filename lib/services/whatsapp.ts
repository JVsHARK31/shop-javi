import { supabase } from '../supabase/client';
import { WAOrderIntent, WhatsAppOrderData } from '../types';
import { generateWhatsAppUrl, formatWhatsAppMessage } from '../format';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6288290286954';

/**
 * Log WhatsApp order intent ke database
 */
export async function logWAOrderIntent(data: WhatsAppOrderData): Promise<void> {
  try {
    const message = formatWhatsAppMessage(data);
    
    const intent: Omit<WAOrderIntent, 'id' | 'created_at'> = {
      product_id: data.productId || null,
      variation_id: data.variationId || null,
      quantity: data.qty,
      message: message,
    };

    const { error } = await supabase
      .from('wa_order_intents')
      .insert([intent]);

    if (error) {
      console.error('Error logging WA order intent:', error);
      // Don't throw error, just log - we don't want to block the WhatsApp redirect
    }
  } catch (error) {
    console.error('Error in logWAOrderIntent:', error);
  }
}

/**
 * Generate WhatsApp order URL dan log intent
 */
export async function createWhatsAppOrder(data: WhatsAppOrderData): Promise<string> {
  // Log intent to database (non-blocking)
  await logWAOrderIntent(data);

  // Generate WhatsApp URL
  const message = formatWhatsAppMessage(data);
  return generateWhatsAppUrl(WHATSAPP_NUMBER, message);
}

/**
 * Open WhatsApp order di tab baru
 */
export function openWhatsAppOrder(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
