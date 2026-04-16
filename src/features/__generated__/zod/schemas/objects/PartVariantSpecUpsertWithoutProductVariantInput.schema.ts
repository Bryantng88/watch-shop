import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutProductVariantInput.schema';
import { PartVariantSpecCreateWithoutProductVariantInputObjectSchema as PartVariantSpecCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecCreateWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PartVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]),
  where: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional()
}).strict();
export const PartVariantSpecUpsertWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpsertWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpsertWithoutProductVariantInput>;
export const PartVariantSpecUpsertWithoutProductVariantInputObjectZodSchema = makeSchema();
