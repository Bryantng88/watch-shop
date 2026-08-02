import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUpdateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedUpdateWithoutProductVariantInput.schema';
import { ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './ClaspVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]),
  where: z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).optional()
}).strict();
export const ClaspVariantSpecUpsertWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUpsertWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpsertWithoutProductVariantInput>;
export const ClaspVariantSpecUpsertWithoutProductVariantInputObjectZodSchema = makeSchema();
