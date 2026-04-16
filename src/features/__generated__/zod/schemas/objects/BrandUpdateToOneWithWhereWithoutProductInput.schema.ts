import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { BrandUpdateWithoutProductInputObjectSchema as BrandUpdateWithoutProductInputObjectSchema } from './BrandUpdateWithoutProductInput.schema';
import { BrandUncheckedUpdateWithoutProductInputObjectSchema as BrandUncheckedUpdateWithoutProductInputObjectSchema } from './BrandUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BrandWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BrandUpdateWithoutProductInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const BrandUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.BrandUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateToOneWithWhereWithoutProductInput>;
export const BrandUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
