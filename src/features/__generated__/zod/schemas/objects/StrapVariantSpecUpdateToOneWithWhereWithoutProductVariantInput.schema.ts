import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInput>;
export const StrapVariantSpecUpdateToOneWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
