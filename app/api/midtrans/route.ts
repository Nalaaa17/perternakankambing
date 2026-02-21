import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Menggunakan Kunci Master agar bisa mengubah database dari belakang layar
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Terima laporan dari Midtrans
    const body = await request.json();
    const { order_id, transaction_status, fraud_status } = body;

    // 2. Terjemahkan bahasa Midtrans ke bahasa sistem kita
    let paymentStatus = 'Belum Dibayar';

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      paymentStatus = 'Sudah Dibayar';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      paymentStatus = 'Gagal/Batal';
    } else if (transaction_status === 'pending') {
      paymentStatus = 'Belum Dibayar';
    }

    // 3. Update status pembayaran di database Supabase
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', order_id); // Cocokkan dengan ID pesanan

    if (error) {
      console.error("Gagal update Supabase:", error);
      throw error;
    }

    // Beri tahu Midtrans bahwa laporan sudah diterima dengan baik
    return NextResponse.json({ status: 'success', message: 'Webhook berhasil diproses' });

  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}