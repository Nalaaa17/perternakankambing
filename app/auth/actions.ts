'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ==========================================
// 1. FUNGSI HELPER (INTERNAL)
// ==========================================

async function uploadImage(file: File) {
  const supabase = await createClient()
  
  // Buat nama file unik agar tidak bentrok di Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  // Upload ke bucket 'product-images'
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (error) throw new Error("Gagal upload ke Storage: " + error.message)

  // Ambil URL publiknya untuk disimpan ke database
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  return publicUrl
}

// ==========================================
// 2. MANAJEMEN PRODUK (ADMIN)
// ==========================================

export async function addProduct(formData: FormData) {
  const supabase = await createClient()

  // Ambil file foto dari form
  const imageFile = formData.get('image') as File
  let imageUrl = '/Foto/bg.jpeg' // Default jika admin tidak upload foto

  // Jika ada file yang diunggah, jalankan mesin upload
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile)
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const { error } = await supabase.from('products').insert([{ 
    name: formData.get('name') as string, 
    description: formData.get('description') as string, 
    price: parseInt(formData.get('price') as string), 
    stock: parseInt(formData.get('stock') as string), 
    unit: formData.get('unit') as string, 
    category: formData.get('category') as string,
    image_url: imageUrl 
  }])

  if (error) {
    console.error('Gagal tambah produk:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/produk')
  return { success: true }
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('productId') as string
  const imageFile = formData.get('image') as File
  let imageUrl = formData.get('currentImageUrl') as string

  // Update foto hanya jika admin memilih file baru
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile)
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const { error } = await supabase
    .from('products')
    .update({ 
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price') as string),
      unit: formData.get('unit'),
      category: formData.get('category'),
      image_url: imageUrl
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/produk')
  return { success: true }
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Gagal hapus produk:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/produk')
  return { success: true }
}

export async function updateStock(productId: string, newStock: number) {
  const supabase = await createClient()

  if (newStock < 0) return { success: false, error: "Stok tidak boleh negatif" }

  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)

  if (error) {
    console.error('Gagal update stok:', error.message)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/produk')
  return { success: true }
}

// ==========================================
// 3. AUTENTIKASI & PROFIL
// ==========================================

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (data.user) {
    await supabase.from('profiles').insert([{ 
      id: data.user.id, 
      full_name: fullName, 
      phone_number: phone, 
      role: 'pembeli' 
    }])
  }

  return redirect('/login?message=Pendaftaran berhasil! Silakan masuk.')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout') 
  return redirect('/login')
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Sesi berakhir" }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name: formData.get('fullName') as string, 
      phone_number: formData.get('phone') as string, 
      address: formData.get('address') as string 
    })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/profil')
  return { success: true }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/dashboard/pesanan');
  return { success: true };
}
export async function updateCartItem(cartId: string, quantity: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', cartId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/keranjang')
  return { success: true }
}

export async function removeCartItem(cartId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('cart_items').delete().eq('id', cartId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/keranjang')
  return { success: true }
}


const midtransClient = require('midtrans-client');

export async function checkoutCart(deliveryMethod: string, totalAmount: number, userAddress: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Harap login terlebih dahulu" }

  // 1. Ambil Data User & Keranjang
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: cartItems } = await supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id)
  if (!cartItems || cartItems.length === 0) return { success: false, error: "Keranjang kosong" }

  // 2. Buat Pesanan di Database (Status masih 'Belum Dibayar')
  const { data: order, error: orderError } = await supabase.from('orders').insert([{
    user_id: user.id,
    customer_name: profile?.full_name || 'Tanpa Nama',
    customer_phone: profile?.phone_number || '-',
    delivery_address: deliveryMethod === 'Antar ke Rumah' ? userAddress : 'Ambil di Kandang',
    delivery_method: deliveryMethod,
    total_price: totalAmount,
    status: 'Menunggu',
    payment_status: 'Belum Dibayar' // <--- Status pembayaran bawaan
  }]).select().single()

  if (orderError) return { success: false, error: orderError.message }

  // 3. Pindahkan barang ke order_items & Kosongkan keranjang
  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    product_name: item.products.name,
    quantity: item.quantity,
    price: item.products.price
  }))
  await supabase.from('order_items').insert(orderItemsData)
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  // 4. MINTA LINK PEMBAYARAN KE MIDTRANS
  try {
    let snap = new midtransClient.Snap({
        isProduction : false, // Ubah ke true nanti kalau sudah rilis resmi
        serverKey : process.env.MIDTRANS_SERVER_KEY
    });

    let parameter = {
        "transaction_details": {
            "order_id": order.id, // Gunakan ID pesanan dari Supabase
            "gross_amount": totalAmount
        },
        "customer_details": {
            "first_name": profile?.full_name || 'Pembeli',
            "phone": profile?.phone_number || '-'
        }
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Kembalikan redirect_url agar pembeli bisa diarahkan ke halaman bayar
    return { success: true, token: transaction.token, orderId: order.id }

  } catch (midtransError: any) {
    return { success: false, error: "Gagal memproses Midtrans: " + midtransError.message }
  }
}

export async function updatePaymentStatusLokal(orderId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: 'Sudah Dibayar' })
    .eq('id', orderId);
  
  if (error) return { success: false, error: error.message }
  return { success: true }
}