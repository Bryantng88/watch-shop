ALTER TYPE "PaymentPurpose" ADD VALUE IF NOT EXISTS 'SALARY';
ALTER TYPE "PaymentPurpose" ADD VALUE IF NOT EXISTS 'OPERATING_EXPENSE';

CREATE TABLE "ExpenseCategory" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
  "code" VARCHAR(50) NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExpenseCategory_code_key" ON "ExpenseCategory"("code");
CREATE INDEX "ExpenseCategory_isActive_sortOrder_idx" ON "ExpenseCategory"("isActive", "sortOrder");

ALTER TABLE "Payment"
  ADD COLUMN "payee_user_id" TEXT,
  ADD COLUMN "payeeName" TEXT,
  ADD COLUMN "expense_category_id" TEXT,
  ADD COLUMN "financeChannel" "AudienceSegment";
CREATE INDEX "idx_payment_payee_user" ON "Payment"("payee_user_id");
CREATE INDEX "idx_payment_expense_category" ON "Payment"("expense_category_id");
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payee_user_id_fkey" FOREIGN KEY ("payee_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "ExpenseCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "ExpenseCategory" ("code", "name", "description", "sortOrder") VALUES
  ('RENT', 'Thuê mặt bằng', 'Tiền thuê cửa hàng, văn phòng hoặc kho', 10),
  ('UTILITIES', 'Điện, nước & Internet', 'Chi phí tiện ích định kỳ', 20),
  ('MARKETING', 'Marketing & quảng cáo', 'Quảng cáo, nội dung và truyền thông', 30),
  ('SOFTWARE', 'Phần mềm & công cụ', 'Phần mềm, dịch vụ và công cụ làm việc', 40),
  ('OFFICE', 'Văn phòng & vật tư', 'Vật tư và chi phí văn phòng', 50),
  ('TAX_FEE', 'Thuế & lệ phí', 'Thuế, lệ phí và phí hành chính', 60),
  ('OTHER', 'Chi phí khác', 'Các chi phí vận hành khác', 999)
ON CONFLICT ("code") DO NOTHING;
