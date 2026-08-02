import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecWhereInputObjectSchema as ClaspVariantSpecWhereInputObjectSchema } from './ClaspVariantSpecWhereInput.schema';
import { ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUpdateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ClaspVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInput>;
export const ClaspVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
