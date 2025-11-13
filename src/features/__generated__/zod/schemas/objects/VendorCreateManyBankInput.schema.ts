import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  role: VendorRoleSchema.optional(),
  isAuthorized: z.boolean().optional(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bankAcc: z.string().optional().nullable()
}).strict();
export const VendorCreateManyBankInputObjectSchema: z.ZodType<Prisma.VendorCreateManyBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateManyBankInput>;
export const VendorCreateManyBankInputObjectZodSchema = makeSchema();
