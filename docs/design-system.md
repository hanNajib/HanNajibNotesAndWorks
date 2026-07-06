# DESIGN SYSTEM & UI/UX SPECIFICATIONS
**Project Name:** HanNajib — Notes & Works  
**Document Type:** Design System Specification  
**Status:** Live / Extracted from Source Code  

---

## 1. Filosofi Desain (Aesthetic Concept)
Platform **HanNajib — Notes & Works** mengusung pendekatan desain **Minimalis, Clean, dan Content-First** dengan sentuhan modern (*Premium Developer Aesthetic*). Desain difokuskan untuk memberikan kenyamanan membaca maksimal layaknya buku digital interaktif, bebas dari distrasi visual berlebih, serta mendukung kegelapan malam (*system-adaptive Dark Mode*).

---

## 2. Tipografi (Typography)
Tipografi menggunakan kombinasi font sans-serif modern yang bersahabat untuk teks panjang dan font monospace untuk kebutuhan penulisan teknis:

* **Primary Font (Body & UI):** `Inter` (sans-serif)
* **Secondary Font (Code & Meta):** `JetBrains Mono` (monospace)

### Hierarki & Skala Tipografi
| Elemen | Ukuran (Mobile) | Ukuran (Desktop) | Ketebalan (Weight) | Kelas Tailwind |
| :--- | :--- | :--- | :--- | :--- |
| **Site Logo** | `text-xl` (20px) | `text-2xl` (24px) | Bold (700) | `font-bold tracking-tight text-zinc-900 dark:text-zinc-50` |
| **Site Subtitle** | `text-sm` (14px) | `text-base` (16px) | Regular (400) | `text-zinc-400 dark:text-zinc-600 font-jetmono` |
| **Intro Bio** | `text-sm` (14px) | `text-base` (16px) | Regular (400) | `text-zinc-600 dark:text-zinc-400 leading-relaxed md:leading-loose` |
| **Heading 1 (Prose)** | `text-3xl` (30px) | `text-4xl` (36px) | Extrabold (800) | `font-extrabold mt-8 md:mt-12 mb-5 md:mb-6 tracking-tight` |
| **Heading 2 (Prose)** | `text-2xl` (24px) | `text-3xl` (30px) | Bold (700) | `font-bold mt-10 md:mt-14 mb-4 md:mb-5 tracking-tight` |
| **Heading 3 (Prose)** | `text-xl` (20px) | `text-2xl` (24px) | Bold (700) | `font-bold mt-8 md:mt-10 mb-3 md:mb-4 tracking-tight` |
| **Heading 4 (Prose)** | `text-lg` (18px) | `text-xl` (20px) | Bold (700) | `font-bold mt-6 md:mt-8 mb-2 md:mb-3 tracking-tight` |
| **Body Paragraph** | `text-sm` (14px) | `text-base` (16px) | Regular (400) | `line-height: 1.8 (leading-relaxed/loose)` |
| **Image Caption** | `text-xs` (12px) | `text-xs` (12px) | Regular (400) | `text-zinc-400 dark:text-zinc-500 font-mono text-center` |

> [!NOTE]
> Semua judul artikel/konten menggunakan properti `text-wrap: balance` untuk memastikan judul tidak terpotong secara canggung di akhir baris.

---

## 3. Palet Warna (Color Palette)
Warna didominasi oleh palet abu-abu netral (*Zinc* dan *Stone*) dengan aksen warna Indigo untuk memberikan kesan profesional dan modern.

### Tema Terang (Light Mode)
* **Background Utama:** `bg-stone-50` (`#fafaf9` - memberikan nuansa putih hangat yang ramah mata)
* **Teks Utama:** `text-zinc-800` (`#27272a`)
* **Teks Judul/Aktif:** `text-zinc-900` (`#18181b`)
* **Teks Sekunder/Meta:** `text-zinc-500` (`#71717a`) / `text-zinc-400` (`#a1a1aa`)
* **Garis Batas (Borders):** `border-zinc-200` (`#e4e4e7`)
* **Warna Seleksi Teks:** `selection:bg-zinc-200`
* **Aksen Link / Teks Kode:** `text-indigo-600` (`#4f46e5`) dengan dekorasi garis bawah `indigo-300/50`.

### Tema Gelap (Dark Mode)
* **Background Utama:** `dark:bg-zinc-950` (`#09090b` - warna hitam arang pekat)
* **Teks Utama:** `dark:text-zinc-200` (`#e4e4e7`)
* **Teks Judul/Aktif:** `dark:text-zinc-50` (`#fafafa`)
* **Teks Sekunder/Meta:** `dark:text-zinc-500` (`#52525b`) / `dark:text-zinc-600` (`#3f3f46`)
* **Garis Batas (Borders):** `dark:border-zinc-800` (`#27272a`)
* **Warna Seleksi Teks:** `dark:selection:bg-zinc-800`
* **Aksen Link / Teks Kode:** `dark:text-indigo-400` (`#818cf8`) dengan dekorasi garis bawah `indigo-700/50`.

---

## 4. Tata Letak & Struktur Grid (Layout & Grid System)
Struktur halaman dibungkus menggunakan container terpusat yang responsif untuk menunjang keterbacaan yang seimbang:

* **Container Utama:** `max-w-5xl mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-16`
* **Header Spacing:** Spasi bagian atas website didesain renggang agar memberikan kesan lapang (*whitespace* yang bersih).
* **Grid Konten:**
  * **Artikel Standar (Notes, Works, TIL):** Layout linear satu kolom vertikal dengan pemisah garis bawah yang halus (`border-b border-zinc-100 dark:border-zinc-900 pb-10`).
  * **Visual Gallery (Snaps):** Grid tipe Masonry responsif menggunakan multi-kolom CSS (`columns-1 sm:columns-2 md:columns-3 gap-6 [column-fill:_balance]`) untuk susunan kartu visual yang dinamis.

---

## 5. Komponen Interaktif & Mikro-Interaksi
Untuk menambah pengalaman premium (*premium developer feel*), website ini mengimplementasikan beberapa detail interaksi:

### Theme Toggle
* Tombol switch bertipe ikon melingkar (`rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900`) yang berganti antara ikon `Sun` dan `Moon` dengan transisi warna halus.

### Smooth Scroll (Lenis Integration)
* Integrasi pustaka **Lenis Smooth Scroll** dengan durasi gulir `1.2` detik dan fungsi pelambatan (*easing*) berbasis eksponensial.
* Mendukung fitur gulir otomatis ke bagian atas halaman secara mulus ketika tombol "Kembali ke atas" diklik.

### Kategori Feed Filter (Tabs)
* Tombol tab kategori (Semua, Notes, Works, TIL, Snaps) menggunakan transisi latar belakang:
  * **Aktif:** Latar belakang abu-abu terang (`bg-zinc-100 dark:bg-zinc-900`) dan teks tegas (`text-zinc-900 dark:text-zinc-50`).
  * **Tidak Aktif:** Tanpa latar belakang (`border-transparent`) dan teks pudar (`text-zinc-500 hover:text-zinc-900`).

### Hover Card Effect
* **Artikel standar:** Transisi warna batas bawah ketika di-hover (`hover:border-zinc-300 dark:hover:border-zinc-700`). Gambar cover artikel akan membesar secara halus sebesar 1% (`group-hover:scale-[1.01]`) selama 500ms.
* **Snaps Card:** Sudut kartu melengkung tinggi (`rounded-2xl md:rounded-3xl`). Gambar visual snaps akan membesar halus 1.5% (`group-hover:scale-[1.015]`) dan memunculkan overlay gelap transparan (`opacity-100`) di atasnya ketika diarahkan kursor.

---

## 6. Elemen Khusus Markdown (Markdown Blocks)
Dokumentasi artikel dilengkapi dengan gaya visual premium untuk bagian kutipan, blok kode, dan notifikasi alert:

### Blockquote (Kutipan)
* Menggunakan border tebal di sisi kiri (`border-l-4 border-zinc-400 dark:border-zinc-600`), latar belakang pastel transparan (`bg-zinc-100/60 dark:bg-zinc-900/40`), teks miring (*italic*), dan jarak padding dalam yang nyaman (`px-5 py-4 rounded-r-xl`).

### Code Blocks (Blok Kode)
* Skema warna blok kode mengadopsi tema gelap layaknya editor Chroma:
  * **Latar Belakang:** Abu-abu arang sangat gelap (`#1e1e24` di mode terang / `#0d0d12` di mode gelap).
  * **Borders:** `#2d2d36` (terang) / `#27272a` (gelap).
  * **Karakteristik:** Font `JetBrains Mono`, ukuran font 14px–15px (`text-xs md:text-sm`), padding luas (`p-6`), sudut membulat (`rounded-xl`), dan dukungan scroll horizontal jika kode terlalu panjang.

### Markdown Alerts (Callouts)
Menggunakan ikon bawaan Lucide melalui skema masker CSS (`mask-image` URL SVG) dengan warna khusus:
1. **Note (Informasi):** Biru (`border-blue-200 bg-blue-50/80 text-blue-900`)
2. **Tip (Saran):** Hijau/Emerald (`border-emerald-200 bg-emerald-50/80 text-emerald-900`)
3. **Important (Penting):** Ungu (`border-purple-200 bg-purple-50/80 text-purple-900`)
4. **Warning (Peringatan):** Oranye (`border-orange-200 bg-orange-50/80 text-orange-900`)
5. **Caution (Bahaya):** Merah (`border-red-200 bg-red-50/80 text-red-900`)

---

## 7. Kustomisasi Editor Quill (Admin Dashboard)
Pada dashboard pengisian artikel admin (`/admin`), editor teks Quill.js disesuaikan agar menghasilkan markup dan visualisasi yang serasi dengan tampilan blog publik:
* **Toolbar:** Bingkai abu-abu tipis (`border-zinc-200` / `border-zinc-800`), latar belakang solid (`#fafafa` / `#09090b`), dengan tombol picker drop-down khusus untuk menyisipkan *Markdown Alert* secara instan.
* **Text Editor Container:** Berwarna putih bersih/gelap pekat, font *Inter* 16px–18px, tinggi minimum 500px, dengan placeholder teks abu-abu yang redup.
