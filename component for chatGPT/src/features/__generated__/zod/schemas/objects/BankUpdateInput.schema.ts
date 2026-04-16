import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BigIntFieldUpdateOperationsInputObjectSchema as BigIntFieldUpdateOperationsInputObjectSchema } from './BigIntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { VendorUpdateManyWithoutBankNestedInputObjectSchema as VendorUpdateManyWithoutBankNestedInputObjectSchema } from './VendorUpdateManyWithoutBankNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.bigint(), z.lazy(() => BigIntFieldUpdateOperationsInputObjectSchema)]).optional(),
  created_at: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  bankName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  Vendor: z.lazy(() => VendorUpdateManyWithoutBankNestedInputObjectSchema).optional()
}).strict();
export const BankUpdateInputObjectSchema: z.ZodType<Prisma.BankUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUpdateInput>;
export const BankUpdateInputObjectZodSchema = makeSchema();
