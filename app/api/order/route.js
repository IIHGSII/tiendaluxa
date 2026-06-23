import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function sendTelegramNotification(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram configurations are missing. Token:', !!token, 'Chat ID:', !!chatId);
    return;
  }

  const cleanPhone = order.cliente_telefono.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanPhone}`;

  const itemsText = order.detalles_pedido.map(item => 
    `• <b>${item.name}</b> (x${item.quantity}) - ₲ ${new Intl.NumberFormat('es-PY').format(item.price * item.quantity)}`
  ).join('\n');

  const text = `<b>📦 Nuevo Pedido Recibido</b>\n\n` +
               `<b>Cliente:</b> ${order.cliente_nombre}\n` +
               `<b>Teléfono:</b> ${order.cliente_telefono}\n` +
               `<b>Dirección:</b> ${order.direccion_envio}\n` +
               `<b>Ciudad:</b> ${order.ciudad}\n` +
               `<b>Total:</b> ₲ ${new Intl.NumberFormat('es-PY').format(order.total_orden)}\n\n` +
               `<b>Detalles del Pedido:</b>\n${itemsText}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "💬 Contactar por WhatsApp",
            url: waUrl
          }
        ]
      ]
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Error sending Telegram notification:', err);
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { cliente_nombre, cliente_telefono, direccion_envio, ciudad, detalles_pedido, total_orden } = body;

    // Validation
    if (!cliente_nombre || !cliente_telefono || !direccion_envio || !ciudad || !detalles_pedido || !total_orden) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Insert order in Supabase
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          cliente_nombre,
          cliente_telefono,
          direccion_envio,
          ciudad,
          detalles_pedido,
          total_orden,
          estado: 'pendiente'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting order into Supabase:', error);
      return NextResponse.json({ error: 'Error al registrar el pedido en la base de datos: ' + error.message }, { status: 500 });
    }

    // Send Telegram Notification
    await sendTelegramNotification(newOrder);

    return NextResponse.json({ success: true, order: newOrder });

  } catch (err) {
    console.error('Unexpected error in order API:', err);
    return NextResponse.json({ error: 'Error interno del servidor: ' + err.message }, { status: 500 });
  }
}
