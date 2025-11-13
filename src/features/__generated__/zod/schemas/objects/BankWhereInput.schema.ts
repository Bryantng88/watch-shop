import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BigIntFilterObjectSchema as BigIntFilterObjectSchema } from './BigIntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { VendorListRelationFilterObjectSchema as VendorListRelationFilterObjectSchema } from './VendorListRelationFilter.schema'

const bankwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BankWhereInputObjectSchema), z.lazy(() => BankWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BankWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BankWhereInputObjectSchema), z.lazy(() => BankWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  bankName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  Vendor: z.lazy(() => VendorListRelationFilterObjectSchema).optional()
}).strict();
export const BankWhereInputObjectSchema: z.ZodType<Prisma.BankWhereInput> = bankwhereinputSchema as unknown as z.ZodType<Prisma.BankWhereInput>;
export const BankWhereInputObjectZodSchema = bankwhereinputSchema;
