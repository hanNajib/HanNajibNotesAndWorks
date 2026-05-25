# Architecture — Han Najib: Notes & Works

## Gambaran Umum

Han Najib — Notes & Works adalah platform digital personal
yang dirancang untuk menjadi tempat berbagi tulisan,
eksperimen, karya, dokumentasi pembelajaran,
serta portofolio jangka panjang.

Arsitektur sistem difokuskan pada:

- Performa tinggi
- Rendering static-first
- Pengiriman JavaScript seminimal mungkin
- SEO optimal
- Infrastruktur serverless
- Biaya operasional rendah
- Kemudahan maintenance jangka panjang

Sistem dirancang agar tetap ringan untuk dikelola sendiri,
namun tetap mampu berkembang secara skalabel.

---

# High Level Architecture

```txt
┌──────────────────────┐
│      Pengunjung      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Vercel Edge CDN    │
│ (Global Distribution)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Astro Static Frontend│
│   + React Islands    │
└───────┬──────────────┘
        │
        ├──────────────┐
        │              │
        ▼              ▼
┌──────────────┐   ┌────────────────┐
│Supabase Auth │   │ Supabase DB    │
└──────────────┘   │ PostgreSQL     │
                   └────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │Supabase Storage│
                   └────────────────┘
````

---

# Prinsip Arsitektur

## 1. Static-First Architecture

Sebagian besar halaman publik akan di-render secara statis saat proses build.

Halaman yang menggunakan SSG:

- Homepage
- Daftar artikel
- Detail artikel
- Portfolio
- About page

Keuntungan:

- Loading sangat cepat
- SEO lebih optimal
- Beban server rendah
- Dapat di-cache di CDN global
- Stabil dan hemat resource

---

## 2. Island Architecture

Komponen interaktif dipisahkan menjadi island kecil menggunakan Astro Islands.

Hanya komponen yang benar-benar membutuhkan interaktivitas
yang akan di-hydrate di sisi client.

Contoh:

- Search bar
- Theme toggle
- Copy code button
- Markdown editor
- Dashboard admin

Dengan pendekatan ini,
JavaScript yang dikirim ke browser menjadi sangat kecil.

---

## 3. Serverless Backend

Backend sepenuhnya menggunakan layanan managed serverless.

Layanan yang digunakan:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Vercel Hosting

Tidak memerlukan VPS atau maintenance server manual.

---

# Frontend Stack

| Layer               | Teknologi     |
| ------------------- | ------------- |
| Framework           | Astro         |
| UI Interaktif       | React         |
| Styling             | Tailwind CSS  |
| Animasi             | GSAP          |
| Markdown            | MDX           |
| Syntax Highlighting | Shiki         |
| Icons               | Lucide        |

---

# Backend Stack

| Layer            | Teknologi                |
| ---------------- | ------------------------ |
| Database         | PostgreSQL               |
| Backend Platform | Supabase                 |
| Authentication   | Supabase Auth            |
| File Storage     | Supabase Storage         |
| Security         | Row Level Security (RLS) |

---

# Strategi Rendering

| Halaman         | Rendering |
| --------------- | --------- |
| Homepage        | SSG       |
| Blog Feed       | SSG       |
| Detail Artikel  | SSG       |
| Portfolio       | SSG       |
| About           | SSG       |
| Dashboard Admin | SSR       |
| Login Admin     | SSR       |

---

# Alur Data

## Alur Pengunjung

1. Pengunjung membuka website
2. Vercel CDN mengirim halaman statis
3. Browser hanya memuat JavaScript yang diperlukan
4. Komponen interaktif diaktifkan secara terpisah

---

## Alur Admin

1. Admin login menggunakan Supabase Auth
2. Dashboard mengambil data artikel secara aman
3. Admin menulis artikel menggunakan Markdown editor
4. Artikel disimpan ke PostgreSQL
5. Sistem memicu revalidation
6. Halaman publik otomatis diperbarui

---

# Struktur Database

## posts

```sql
posts
- id UUID PRIMARY KEY
- title TEXT
- slug TEXT UNIQUE
- excerpt TEXT
- content TEXT
- cover_image TEXT
- status TEXT
- created_at TIMESTAMP
- updated_at TIMESTAMP
- published_at TIMESTAMP
- author_id UUID
```

---

## categories

```sql
categories
- id UUID PRIMARY KEY
- name TEXT
- slug TEXT UNIQUE
```

---

# Authentication & Security

## Sistem Keamanan

Semua operasi mutasi data dilindungi menggunakan:

- Supabase Auth
- Row Level Security (RLS)

Hanya admin terautentikasi yang dapat:

- Membuat artikel
- Mengedit artikel
- Menghapus artikel

---

## Best Practices Keamanan

- Mengaktifkan 2FA pada akun Supabase
- Membatasi operasi write menggunakan RLS
- Tidak mengekspos service role key ke frontend
- Menggunakan environment variable dengan aman
- Melakukan validasi input pada seluruh form

---

# Strategi Optimasi Performa

## Teknik yang Digunakan

- Static Site Generation
- CDN edge caching
- Astro island hydration
- Minimal JavaScript delivery
- Optimasi gambar
- Build-time syntax highlighting
- Lazy loading media
- Font optimization

---

# Strategi SEO

## Fitur SEO

- Semantic HTML
- Dynamic meta tags
- OpenGraph
- Canonical URL
- Sitemap otomatis
- RSS Feed
- Structured Data (JSON-LD)

---

# Strategi Konten

## Workflow Berbasis Markdown

Artikel disimpan dalam format Markdown.

Keuntungan:

- Portable
- Ringan
- Mudah di-versioning
- Mudah dimigrasikan
- Fleksibel untuk jangka panjang

---

# Strategi Skalabilitas

Sistem diskalakan melalui:

- Static page delivery
- Distribusi CDN global
- Minim ketergantungan backend
- Penggunaan database yang efisien

Pendekatan ini memungkinkan website menangani traffic besar
dengan biaya infrastruktur yang sangat rendah.

---

# Deployment Pipeline

## Alur Deployment

1. Push code ke GitHub
2. Vercel otomatis melakukan build
3. Astro menghasilkan static pages
4. CDN diperbarui secara global
5. Website otomatis terdeploy

---

# Kemungkinan Pengembangan di Masa Depan

Beberapa fitur yang dapat ditambahkan:

- Multi-language content
- Full-text search indexing
- Newsletter system
- Reading progress sync
- AI-assisted writing tools
- CMS abstraction layer
- PWA / offline support

---

# Filosofi Arsitektur

Arsitektur ini mengutamakan:

- Kesederhanaan
- Kejelasan
- Kecepatan
- Efisiensi
- Keberlanjutan jangka panjang

Tujuan utama sistem bukan hanya membangun blog,
melainkan menciptakan ruang digital personal
yang dapat berkembang bersama perjalanan kreatornya.
