import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema';
import { StrapVariantSpecUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => StrapVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const StrapVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpdateToOneWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpdateToOneWithWhereWithoutVariantInput>;
export const StrapVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectZodSchema = makeSchema();
