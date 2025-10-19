import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema';
import { PartVariantSpecUpdateWithoutVariantInputObjectSchema as PartVariantSpecUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PartVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const PartVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpdateToOneWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpdateToOneWithWhereWithoutVariantInput>;
export const PartVariantSpecUpdateToOneWithWhereWithoutVariantInputObjectZodSchema = makeSchema();
