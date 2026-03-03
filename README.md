# Toyota Diagnostic Pro (TDP) - ระบบศูนย์บริการรถยนต์

ระบบบริหารจัดการศูนย์บริการรถยนต์ที่เน้นความปลอดภัยและความโปร่งใส (Phase 1)

## ฟีเจอร์หลัก
- **Security Layer**: ระบบ Authentication และ RBAC (Admin, Staff, Auditor)
- **Gate Layer**: Middleware ตรวจสอบสิทธิ์และรูปแบบข้อมูลก่อนบันทึก
- **Immutable Logs**: บันทึกประวัติการใช้งานที่ไม่สามารถแก้ไขได้
- **Diagnostic Dashboard**: ระบบจำลองการวินิจฉัยรถยนต์ (OBD/CAN Bus)
- **Service Management**: จัดการข้อมูลลูกค้า รถยนต์ และประวัติการซ่อม

## วิธีการใช้งาน
1. เข้าสู่ระบบด้วยบัญชีที่กำหนด (Admin, Staff, หรือ Auditor)
2. ใช้งานโมดูลต่างๆ ตามสิทธิ์ที่ได้รับ
3. ตรวจสอบ Log การใช้งานได้ที่หน้า Audit Logs (เฉพาะ Admin และ Auditor)

## เทคโนโลยีที่ใช้
- Next.js 15 (App Router)
- Tailwind CSS
- SQLite (better-sqlite3)
- Recharts (Data Visualization)
- Framer Motion (Animations)
