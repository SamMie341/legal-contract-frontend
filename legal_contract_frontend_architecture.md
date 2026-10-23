# 📜 Legal & Contract Management System - Frontend Architecture

เอกสารอ้างอิงสถาปัตยกรรมและโครงสร้างโปรเจกต์สำหรับระบบจัดการสัญญาและเอกสารทางกฎหมาย (Legal & Contract) พัฒนาด้วยหลักการ **Clean Architecture** เพื่อให้ระบบดูแลรักษาง่าย ขยายผลต่อได้ และแยก Business Logic ออกจาก UI อย่างชัดเจน

## 🛠 Tech Stack & Tools
- **Framework:** Next.js v16.4.2 (App Router)
- **Package Manager:** `npm` (ใช้ npm เป็นหลักตามมาตรฐาน)
- **Bundler:** Webpack (ปิดการใช้งาน / ไม่ใช้ Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (Global State) + TanStack Query (Server State)

---

## 🎨 Design System & โทนสี
ระบบถูกออกแบบมาให้ดูเป็นทางการ น่าเชื่อถือ และถนอมสายตา (ไม่สว่างจ้า) 

| ประเภทสี | รหัสสี (Hex) | การใช้งาน |
| :--- | :--- | :--- |
| **Primary** | `#162456` | Header, Sidebar, ปุ่มหลัก (Primary Button), สีเน้นข้อความ |
| **Primary Hover** | `#1D2F6F` | สถานะ Hover ของปุ่มหลัก หรือ Action Menu |
| **Background Base** | `#F0F2F5` | สีพื้นหลังหลักของแอปพลิเคชัน (เทาอมฟ้าอ่อน ถนอมสายตา ลดแสงสะท้อน) |
| **Surface/Card** | `#FAFAFA` | สีพื้นหลังของ Card, Modal, หรือ Paper |
| **Text Primary** | `#1E293B` | สีตัวอักษรหลัก (Slate 800 - ไม่ใช้สีดำสนิทเพื่อลดความล้าของสายตา) |
| **Text Secondary**| `#475569` | สีตัวอักษรรอง, Label, Placeholder (Slate 600) |
| **Border/Line** | `#E2E8F0` | เส้นคั่น, ขอบของ Card หรือ Input |

---

## 📂 โครงสร้างโฟลเดอร์ (Clean Architecture)

การจัดโครงสร้างจะยึดหลัก Clean Architecture โดยแบ่งเป็น 4 Layers หลัก ภายในโฟลเดอร์ `src/`

```text
src/
 ├── core/                  # 1. Domain Layer (แกนกลางของระบบ)
 │    ├── entities/         # Interface/Type ของข้อมูล (เช่น Contract, User, Document)
 │    └── errors/           # Custom Error Classes
 │
 ├── application/           # 2. Application Layer (Use Cases)
 │    ├── use-cases/        # Business Logic (เช่น CreateContractUseCase, ApproveLegalDoc)
 │    └── store/            # Global State Management (Zustand store)
 │
 ├── infrastructure/        # 3. Infrastructure Layer (เชื่อมต่อภายนอก)
 │    ├── api/              # API Clients (Axios/Fetch configurations)
 │    ├── repositories/     # Implementation ของการดึงข้อมูล (ต่อ API หรือ LocalStorage)
 │    └── services/         # บริการภายนอก (เช่น Firebase, AWS S3, OAuth)
 │
 ├── presentation/          # 4. Presentation Layer (UI & View)
 │    ├── components/       # UI Components (แบ่งย่อยเป็น atoms, molecules, organisms)
 │    ├── hooks/            # Custom React Hooks (รวมถึง React Query hooks)
 │    └── layouts/          # โครงสร้างหน้า (Sidebar, Topbar)
 │
 ├── app/                   # Next.js App Router (Pages & Routing)
 │    ├── (auth)/           # Route กลุ่ม Authentication
 │    │    └── login/page.tsx
 │    ├── contracts/        # Route กลุ่มสัญญา
 │    │    ├── page.tsx
 │    │    └── [id]/page.tsx
 │    ├── layout.tsx        # Root Layout
 │    └── globals.css       # Global Styles
 │
 └── utils/                 # Utility functions ทั่วไป (เช่น แปลงวันที่, format เงิน)
```

---

## ⚙️ การตั้งค่าที่สำคัญ (Configurations)

### 1. `package.json` (ไม่ใช้ Turbopack)
ใช้คำสั่ง script พื้นฐานของ Next.js ผ่าน `npm` โดยหลีกเลี่ยงการเติม flag `--turbo`

```json
{
  "name": "legal-contract-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.4.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 2. `tailwind.config.ts` (ตั้งค่าสี)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#162456', // Legal & Contract Primary Navy
          hover: '#1D2F6F',
        },
        background: '#F0F2F5', // Soft background
        surface: '#FAFAFA',
        text: {
          primary: '#1E293B',
          secondary: '#475569',
        },
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
export default config
```

### 3. ตัวอย่างการใช้คำสั่ง `npm` สำหรับเริ่มโปรเจกต์
```bash
# สร้างโปรเจกต์ใหม่ (Next.js จะถามการตั้งค่า ให้เลือก App Router, TS, Tailwind)
npx create-next-app@16.4.2 legal-contract-frontend

# เข้าไปที่โฟลเดอร์โปรเจกต์
cd legal-contract-frontend

# รัน Development Server (รันผ่าน Webpack ปกติ ไม่ใช้ Turbopack)
npm run dev
```

---

## 💡 แนวทางการเขียนโค้ด (Best Practices)
1. **Separation of Concerns:** Component ใน `app/` และ `presentation/components/` มีหน้าที่แค่แสดงผล (UI) เท่านั้น ห้ามนำ Business Logic ไปเขียนใน Component เด็ดขาด
2. **Use Cases:** ถ้ามีการประมวลผลข้อมูลทางกฎหมายหรือตรวจสอบสิทธิ์ (Validation) ให้เรียกใช้ฟังก์ชันใน `application/use-cases/`
3. **Data Fetching:** ใช้ Next.js Server Components ให้มากที่สุด หากฝั่ง Client ต้องดึงข้อมูลให้ดึงผ่าน `TanStack Query` ที่เชื่อมกับ `infrastructure/repositories/`
