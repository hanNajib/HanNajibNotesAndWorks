# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** HanNajib — Notes & Works

**Author:** Ahmad Royhan Najib (Han Najib)

**Role:** Senior Product Manager

**Date:** May 25, 2026

**Status:** Draft / Ready for Engineering Review

---

## 1. Executive Summary

Platform ini dirancang sebagai blog pribadi dan portofolio digital interaktif milik Ahmad Royhan Najib (Han Najib). Masalah utama yang diselesaikan adalah tidak adanya wadah terpusat yang efisien untuk mendokumentasikan *knowledge sharing*, proyek *software development*, serta rekam jejak profesional penulisan secara terstruktur. Akibatnya, potensi *personal branding* dan penyebaran ilmu menjadi tidak optimal.

Solusi yang dihadirkan adalah platform web blog berbasis *serverless architecture* yang memadukan kecepatan tinggi di sisi pengguna akhir dengan fleksibilitas manajemen konten di sisi pemilik (CRUD). Dari segi *frontend*, penggunaan **Astro** atau **Next.js (App Router dengan Static Site Generation - SSG)** sangat direkomendasikan karena sifatnya yang super ringan, memiliki *bundle size* minimal, dan optimal untuk SEO. Di sisi backend, **Supabase** digunakan sebagai penyedia *database* PostgreSQL dan *Authentication* secara gratis (*free tier*), menjamin *zero-cost maintenance* tanpa mengorbankan performa.

*Value proposition* produk ini terletak pada keseimbangan antara performa kecepatan *loading* halaman (untuk pembaca) dan kemudahan manajemen artikel yang aman (untuk pemilik). Blog ini tidak hanya berfungsi sebagai media membaca konvensional, melainkan juga sebagai bukti nyata (portofolio hidup) atas kapabilitas teknis Han Najib dalam membangun arsitektur web modern yang efisien dan berskala tinggi.

---

## 2. Problem Statement & User Personas

### 2.1 Problem Statement

1. **Bagi Pembaca (Komunitas Tech):** Sulit menemukan artikel tutorial atau *insight* teknologi berbahasa Indonesia yang ditulis secara runut, minim distrasi iklan, dan memiliki waktu pemuatan (*loading time*) halaman yang cepat di perangkat *mobile*.
2. **Bagi Pemilik (Han Najib):** Kebutuhan akan platform mandiri untuk mengelola konten (CRUD) secara fleksibel, aman, dan gratis, tanpa harus bergantung pada platform pihak ketiga seperti Medium atau Substack yang membatasi kustomisasi dan kontrol data.

### 2.2 User Personas

#### Persona 1: Pembaca Umum / Sesama Developer

* **Demografi:** Gathan, 19 tahun, Mahasiswa Teknik Informatika / Junior Developer, Berdomisili di Surabaya.
* **Tujuan:** Mencari referensi kode, tutorial *web development* yang praktis, dan dokumentasi penyelesaian *bug* riil.
* **Frustrasi:** Menemukan blog teknologi yang lambat diakses, dipenuhi iklan pop-up, atau kode *snippet* yang tidak memiliki fitur *copy-to-clipboard*.

#### Persona 2: Pemilik Platform (Han Najib)

* **Demografi:** Han Najib, 18 tahun, Student & Web Developer.
* **Tujuan:** Mengunggah tulisan teknis kapan saja, memamerkan portofolio, dan memiliki dashboard admin pribadi yang aman tanpa biaya operasional.
* **Frustrasi:** Kompleksitas *maintenance* server dan database konvensional yang memakan biaya bulanan hanya untuk sebuah blog pribadi.

---

## 3. Product Vision & Success Metrics (KPIs)

### 3.1 Product Vision

Menjadi platform jurnal teknologi personal yang paling ringan, estetik, dan responsif, sekaligus berfungsi sebagai portofolio digital yang merepresentasikan keahlian teknik pemrograman pemiliknya secara global.

### 3.2 Success Metrics (KPIs)

* **Performance Rate (Lighthouse Score):** Meraih skor $> 95$ untuk aspek *Performance*, *Accessibility*, *Best Practices*, dan *SEO* pada Google Lighthouse.
* **Speed Index:** Waktu pemuatan halaman pertama (First Contentful Paint) berada di bawah $1.2\text{ detik}$.
* **Activation Rate (Admin):** Pemilik dapat melakukan *publish* satu artikel baru dari dashboard admin dalam waktu kurang dari 2 menit (dari input hingga *live*).
* **Retention Rate (Visitor):** Memperoleh rata-rata waktu baca (Average Session Duration) di atas 3 menit per kunjungan artikel.

---

## 4. Scope & Features (MoSCoW Framework)

| Nama Fitur | Deskripsi/Tujuan | Prioritas |
| --- | --- | --- |
| **Public Blog Feed** | Menampilkan daftar seluruh artikel blog yang sudah di-publish, diurutkan dari yang terbaru, dilengkapi pencarian dan filter kategori. | Must-have |
| **Secure Authentication** | Halaman login khusus admin menggunakan Supabase Auth untuk melindungi akses ke dashboard manajemen konten. | Must-have |
| **Admin CRUD Dashboard** | Halaman khusus Han Najib untuk membuat (Create), membaca (Read), mengubah (Update), dan menghapus (Delete) artikel langsung dari web. | Must-have |
| **Markdown Editor with Preview** | Input teks artikel menggunakan format Markdown, dilengkapi dengan *real-time preview* sebelum artikel di-publish. | Must-have |
| **Syntax Highlighting** | Tampilan potongan kode (*code block*) di artikel memiliki pewarnaan sintaksis otomatis dan tombol *copy code* agar ramah developer. | Should-have |
| **Portfolio Section** | Halaman statis khusus untuk menampilkan biodata singkat, keahlian, dan daftar proyek/aplikasi yang pernah dibuat Han Najib. | Should-have |
| **Analytics Integration** | Integrasi pelacak anonim (seperti Umami atau Google Analytics) untuk memantau jumlah pembaca tanpa melanggar privasi. | Could-have |
| **Dark/Light Mode Toggle** | Fitur bagi pengunjung untuk mengubah tema tampilan antara mode gelap dan terang sesuai kenyamanan mata. | Could-have |
| **Comment System** | Kolom komentar di bawah artikel menggunakan integrasi pihak ketiga yang ringan (misal: Giscus menggunakan GitHub Discussions). | Won't-have (Fase 1) |

---

## 5. User Flows / User Journey

### Alur 1: Membaca Artikel (Pengunjung Umum)

1. Pengunjung mengakses URL utama blog (`batenan.dev` atau sejenisnya).
2. Sistem melakukan *fetching* data artikel statis (SSG) dan menampilkannya di halaman utama $< 1$ detik.
3. Pengunjung memilih salah satu judul artikel dari daftar.
4. Sistem membuka halaman detail artikel beserta isi konten dan *syntax highlighting* kode.
5. Pengunjung membaca artikel dan dapat menyalin potongan kode menggunakan tombol *copy*.

### Alur 2: Manajemen Konten / CRUD (Han Najib selaku Admin)

1. Admin mengakses rute tersembunyi (misal: `/admin/login`).
2. Admin memasukkan email dan *password*, lalu menekan tombol "Login".
3. Supabase Auth memvalidasi kredensial. Jika valid, sistem mengarahkan ke halaman Admin Dashboard.
4. Admin memilih opsi "Tulis Artikel Baru".
5. Admin mengisi judul, kategori, dan menulis isi artikel menggunakan format Markdown di kolom editor.
6. Admin menekan tombol "Publish".
7. Sistem menembak API Supabase untuk menyimpan data ke tabel `posts`, lalu memicu *revalidation* otomatis pada hosting (Vercel) agar artikel langsung muncul di halaman publik tanpa perlu *build* ulang total.

---

## 6. Functional & Non-Functional Requirements

### 6.1 Functional Requirements (User Stories)

* **Sebagai Pembaca**, saya ingin **melihat daftar artikel blog yang teratur**, agar **saya dapat memilih topik yang ingin saya pelajari dengan mudah**.
* **Sebagai Pembaca**, saya ingin **fitur pencarian artikel**, agar **saya bisa langsung menemukan tutorial spesifik tanpa melakukan *scrolling* manual**.
* **Sebagai Admin (Han Najib)**, saya ingin **sistem otentikasi yang ketat**, agar **tidak ada pengguna gelap yang bisa memodifikasi atau menghapus artikel saya**.
* **Sebagai Admin (Han Najib)**, saya ingin **menyimpan draf artikel (status: draft/published)**, agar **saya bisa mencicil tulisan sebelum benar-benar dipublikasikan secara umum**.

### 6.2 Non-Functional Requirements

* **Performance & Lightness:** Aplikasi harus menggunakan framework *frontend* yang menghasilkan *client-side JavaScript* seminimal mungkin. Jika menggunakan Next.js, wajib menerapkan optimasi gambar (`next/image`) dan *Component Memoization*. Jika menggunakan Astro, manfaatkan arsitektur *Islands* (0kb JS secara default).
* **Security:** Semua operasi mutasi data (POST, PUT, DELETE) di database Supabase wajib dilindungi oleh *Row Level Security* (RLS) yang memastikan hanya *authenticated user* (UID milik Han Najib) yang memiliki hak akses.
* **Scalability & Cost:** Sistem harus berjalan di atas infrastruktur *serverless edge network* (Vercel/Netlify Free Tier) dan database *free tier* (Supabase), yang mampu menangani hingga $50.000\text{ request/bulan}$ tanpa memicu lonjakan biaya.
* **SEO & Accessibility:** Struktur HTML wajib semantik (`<article>`, `<header>`, `<nav>`) dan memiliki meta tags dinamis (OpenGraph) di setiap artikel untuk optimasi pembagian tautan di media sosial.

---

## 7. Assumptions, Dependencies & Risks

### 7.1 Assumptions

* **Asumsi Teknis:** Struktur data penulisan artikel dominan berbentuk teks dan kode pemrograman. Alokasi penyimpanan gambar/aset visual akan diletakkan di Supabase Storage (bukan disimpan sebagai *base64 string* di dalam database) untuk menghemat ruang tabel.

### 7.2 Dependencies

* **Supabase Client SDK:** Keberlanjutan operasional backend bergantung penuh pada stabilitas *uptime* server gratis dari Supabase.
* **Hosting Provider (Vercel/Netlify):** Pipeline *deployment* otomatis bergantung pada ketersediaan layanan *platform-as-a-service* tersebut.

### 7.3 Risks & Mitigations

* **Risiko 1: Kebocoran Akses CRUD Admin**
* *Mitigasi:* Mengaktifkan Two-Factor Authentication (2FA) pada akun Supabase milik Han Najib dan menerapkan aturan RLS (Row Level Security) yang sangat ketat di level tabel PostgreSQL.


* **Risiko 2: Limitasi Kuota Database Gratis (Supabase Free Tier)**
* *Mitigasi:* Rutin melakukan pembersihan aset yang tidak digunakan dan memastikan teks artikel disimpan secara efisien tanpa duplikasi data. Jika kuota mendekati batas, sistem dapat dipindahkan ke skema penyimpanan file Markdown lokal di dalam repositori Git.