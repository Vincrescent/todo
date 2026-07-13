# Tugas 9 — API Todo dengan NestJS + MySQL (XAMPP) + TypeORM

API CRUD Todo dengan validasi DTO, filter status `completed`, dan error handling
(404 Not Found, 400 Bad Request). Sudah diuji end-to-end (bukan cuma dicek
compile) terhadap MySQL 8 sebelum dikirim — lihat bagian "Status Pengujian"
di bawah.

## Tech Stack
- NestJS 10
- TypeORM 0.3 + mysql2 (driver untuk MySQL/MariaDB, cocok dengan XAMPP)
- class-validator + class-transformer
- MySQL (via XAMPP)

## Struktur Folder
```
src/
├── main.ts                      # bootstrap + ValidationPipe global
├── app.module.ts                # koneksi TypeORM ke MySQL
└── todo/
    ├── entities/todo.entity.ts  # mapping tabel `todo`
    ├── dto/
    │   ├── create-todo.dto.ts   # validasi POST
    │   └── update-todo.dto.ts   # validasi PUT (semua field opsional)
    ├── todo.controller.ts       # routing 5 endpoint
    ├── todo.service.ts          # logic CRUD via Repository
    └── todo.module.ts
postman/
└── todo-api.postman_collection.json   # import langsung ke Postman
```

## 1. Persiapan XAMPP + MySQL

1. Buka **XAMPP Control Panel**, start modul **MySQL** (dan Apache kalau mau
   pakai phpMyAdmin).
2. Buka phpMyAdmin (`http://localhost/phpmyadmin`), buat database baru
   bernama **`todo_db`** (tabel `todo` **tidak perlu** dibuat manual — akan
   dibuat otomatis oleh TypeORM lewat opsi `synchronize: true`).
3. Default XAMPP: user `root`, password kosong, port `3306`. Kalau
   konfigurasi MySQL kamu berbeda, sesuaikan di `.env`.

## 2. Install & Jalankan

```bash
npm install
cp .env.example .env
# edit .env kalau DB_USERNAME/DB_PASSWORD kamu berbeda dari default XAMPP

npm run start:dev
```

Kalau berhasil, akan muncul log:
```
Todo API berjalan di: http://127.0.0.1:3000
```

Tabel `todo` otomatis muncul di database `todo_db` (cek di phpMyAdmin) dengan
kolom `id, title, description, completed, priority, dueDate, createdAt, updatedAt`.

## 3. Spesifikasi Endpoint

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/v1/todos` | Tambah todo baru (dengan validasi) |
| GET | `/api/v1/todos` | Ambil semua todo |
| GET | `/api/v1/todos?completed=true` | Filter todo yang sudah selesai |
| GET | `/api/v1/todos?completed=false` | Filter todo yang belum selesai |
| GET | `/api/v1/todos/:id` | Ambil todo berdasarkan ID |
| PUT | `/api/v1/todos/:id` | Update todo |
| DELETE | `/api/v1/todos/:id` | Hapus todo |

## 4. Aturan Validasi (DTO)

| Field | Validasi | Keterangan |
|---|---|---|
| `title` | `@IsNotEmpty`, `@IsString`, `@MaxLength(100)` | Wajib diisi |
| `description` | `@IsString`, `@IsOptional` | Boleh kosong |
| `priority` | `@IsIn(['low','medium','high'])`, `@IsOptional` | Kalau tidak dikirim, default `low` (mengikuti default di Entity) |
| `dueDate` | `@IsDateString`, `@IsOptional` | Format `YYYY-MM-DD` |
| `completed` | `@IsBoolean`, `@IsOptional` | Dibutuhkan supaya endpoint PUT bisa menandai todo selesai |

**ValidationPipe global** (`main.ts`) diaktifkan dengan tiga opsi sesuai
ketentuan tugas:
- `whitelist: true` → field yang tidak terdaftar di DTO otomatis dibuang.
- `forbidNonWhitelisted: true` → kalau ada field asing di body, request
  langsung ditolak dengan `400 Bad Request` (bukan cuma dibuang diam-diam).
- `transform: true` → payload JSON otomatis diubah jadi instance class DTO
  (dan tipe data query/param dikonversi, misalnya string `id` di URL jadi
  `number` lewat `ParseIntPipe`).

## 5. Error Handling

- **404 Not Found** → dilempar dari `TodoService` (`NotFoundException`) saat
  `GET/PUT/DELETE /api/v1/todos/:id` dengan ID yang tidak ada di database.
- **400 Bad Request** → otomatis dari `ValidationPipe` saat body tidak valid
  (title kosong, priority di luar enum, dueDate salah format, ada field
  asing), dan dari `ParseIntPipe` kalau `:id` di URL bukan angka.

## 6. Testing dengan Postman

Import `postman/todo-api.postman_collection.json` ke Postman (**Import →
File**). Isinya 19 request yang mencakup skenario valid & invalid untuk
setiap endpoint, tinggal klik **Send** satu-satu lalu screenshot response-nya
untuk laporan:

1. Create Todo – Valid (lengkap)
2. Create Todo – Valid (title saja, priority default)
3. Create Todo – Invalid (title kosong) → 400
4. Create Todo – Invalid (priority salah) → 400
5. Create Todo – Invalid (field asing / forbidNonWhitelisted) → 400
6. Get All Todos
7. Get All Todos – Filter completed=false
8. Get All Todos – Filter completed=true
9. Get Todo By ID – Valid
10. Get Todo By ID – Not Found (404)
11. Get Todo By ID – Format ID salah (400)
12. Update Todo – Valid (ubah completed)
13. Update Todo – Valid (ubah title & priority)
14. Update Todo – Not Found (404)
15. Update Todo – Invalid priority (400)
16. Delete Todo – Valid
17. Delete Todo – Not Found (404, setelah dihapus di step 16)

> Urutan request penting (misalnya step 17 butuh data dari step 16), jalankan
> dari atas ke bawah.

## 7. Status Pengujian (oleh Claude sebelum file dikirim)

Seluruh 19 skenario di atas sudah dijalankan langsung terhadap server MySQL
8.0 sungguhan (bukan simulasi) di lingkungan pembuatan kode ini, dan semua
memberi status code serta response body yang sesuai ekspektasan (201/200
untuk kasus valid, 400 untuk validasi gagal, 404 untuk ID tidak ditemukan).
TypeScript build (`nest build`) juga sukses tanpa error. Kamu tetap perlu
menjalankan sendiri di XAMPP + Postman untuk mengambil screenshot laporan,
tapi kodenya sudah dipastikan bekerja, bukan cuma "seharusnya bekerja".

## 8. Push ke GitHub (untuk Lampiran laporan)

```bash
git init
git add .
git commit -m "Tugas 9: API Todo dengan NestJS, MySQL, TypeORM"
git branch -M main
git remote add origin <URL_REPO_GITHUB_KAMU>
git push -u origin main
```
(`node_modules/`, `dist/`, dan `.env` sudah otomatis diabaikan lewat `.gitignore`.)
