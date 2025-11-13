import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BigIntWithAggregatesFilterObjectSchema as BigIntWithAggregatesFilterObjectSchema } from './BigIntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const bankscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => BankScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BankScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BankScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BankScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BankScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => BigIntWithAggregatesFilterObjectSchema), z.bigint()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  bankName: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const BankScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BankScalarWhereWithAggregatesInput> = bankscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.BankScalarWhereWithAggregatesInput>;
export const BankScalarWhereWithAggregatesInputObjectZodSchema = bankscalarwherewithaggregatesinputSchema;
