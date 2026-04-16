import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandUpdateWithoutProductInputObjectSchema as BrandUpdateWithoutProductInputObjectSchema } from './BrandUpdateWithoutProductInput.schema';
import { BrandUncheckedUpdateWithoutProductInputObjectSchema as BrandUncheckedUpdateWithoutProductInputObjectSchema } from './BrandUncheckedUpdateWithoutProductInput.schema';
import { BrandCreateWithoutProductInputObjectSchema as BrandCreateWithoutProductInputObjectSchema } from './BrandCreateWithoutProductInput.schema';
import { BrandUncheckedCreateWithoutProductInputObjectSchema as BrandUncheckedCreateWithoutProductInputObjectSchema } from './BrandUncheckedCreateWithoutProductInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './BrandWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BrandUpdateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => BrandCreateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductInputObjectSchema)]),
  where: z.lazy(() => BrandWhereInputObjectSchema).optional()
}).strict();
export const BrandUpsertWithoutProductInputObjectSchema: z.ZodType<Prisma.BrandUpsertWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpsertWithoutProductInput>;
export const BrandUpsertWithoutProductInputObjectZodSchema = makeSchema();
