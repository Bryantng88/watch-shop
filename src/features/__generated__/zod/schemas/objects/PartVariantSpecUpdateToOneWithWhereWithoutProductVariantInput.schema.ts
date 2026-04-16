import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema';
import { PartVariantSpecUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PartVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInput>;
export const PartVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
