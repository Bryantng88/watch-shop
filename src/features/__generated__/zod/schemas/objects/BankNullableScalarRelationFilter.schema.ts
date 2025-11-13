import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './BankWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => BankWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => BankWhereInputObjectSchema).optional().nullable()
}).strict();
export const BankNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.BankNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BankNullableScalarRelationFilter>;
export const BankNullableScalarRelationFilterObjectZodSchema = makeSchema();
