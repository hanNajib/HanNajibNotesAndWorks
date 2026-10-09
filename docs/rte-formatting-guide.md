# RTE Formatting Guide for AI Content Generation

Panduan ini menjelaskan format yang didukung oleh Rich Text Editor (Quill) di blog ini. Gunakan panduan ini saat AI generate konten untuk memastikan format yang dihasilkan kompatibel.

## Supported Formatting

### Headers
- **H2** (`##`) - Heading utama untuk section
- **H3** (`###`) - Sub-heading
- **H4** (`####`) - Sub-sub-heading
- **NO H1** - H1 reserved untuk judul artikel (tidak ada di editor)

### Text Formatting
- **Bold** - Teks tebal
- *Italic* - Teks miring
- <u>Underline</u> - Teks bergaris bawah
- ~~Strikethrough~~ - Teks tercoret

### Blocks

#### Blockquote
```
> Ini adalah kutipan atau highlight penting
```

#### Code Block
```
function example() {
  return "code block untuk snippet kode";
}
```

### Lists
- **Bullet list** (unordered)
  - Item 1
  - Item 2
- **Numbered list** (ordered)
  1. First
  2. Second

### Alignment
- Left align (default)
- Center align
- Right align
- Justify

### Media

#### Link
Format: `[teks link](https://url.com)`

#### Image
Upload atau URL gambar

#### Video
Embed video (YouTube, Vimeo, dll)

### Alert Blocks (Custom)
5 jenis alert box tersedia:

#### Note (Informasi umum)
```
[!NOTE]
Catatan atau informasi tambahan
```

#### Tip (Saran/Tips)
```
[!TIP]
Tips atau best practice
```

#### Important (Penting)
```
[!IMPORTANT]
Informasi yang harus diperhatikan
```

#### Warning (Peringatan)
```
[!WARNING]
Peringatan atau hal yang perlu diwaspadai
```

#### Caution (Hati-hati)
```
[!CAUTION]
Bahaya atau risiko serius
```

## Guidelines untuk AI

1. **Jangan gunakan H1** - H1 otomatis dari judul artikel
2. **Mulai dari H2** untuk struktur konten
3. **Gunakan alert blocks** untuk highlight info penting
4. **Code blocks** untuk semua snippet kode
5. **Blockquote** untuk kutipan atau emphasis
6. **Lists** untuk enumerasi atau langkah-langkah
7. **Bold/italic** untuk penekanan dalam paragraf
8. **Links** untuk referensi eksternal

## Contoh Struktur Konten yang Baik

```markdown
## Pengenalan Topik

Paragraf pembuka dengan **penekanan penting** dan *detail tambahan*.

> Kutipan atau insight penting di sini

### Sub-topik Pertama

Penjelasan dengan contoh kode:

\`\`\`javascript
const example = "code here";
\`\`\`

[!TIP]
Tips berguna untuk pembaca

### Sub-topik Kedua

Langkah-langkah implementasi:

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga

[!WARNING]
Hati-hati dengan edge case ini

## Kesimpulan

Ringkasan dengan [link ke resource](https://example.com)
```

## Output Format

Saat AI generate konten, pastikan output dalam **HTML format** yang kompatibel dengan Quill editor, bukan Markdown mentah. Quill menyimpan konten sebagai HTML dengan class dan tag khusus.
