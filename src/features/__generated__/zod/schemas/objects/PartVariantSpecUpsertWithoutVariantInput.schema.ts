import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartVariantSpecUpdateWithoutVariantInputObjectSchema as PartVariantSpecUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUpdateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedUpdateWithoutVariantInput.schema';
import { PartVariantSpecCreateWithoutVariantInputObjectSchema as PartVariantSpecCreateWithoutVariantInputObjectSchema } from './PartVariantSpecCreateWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PartVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => PartVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => PartVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]),
  where: z.lazy(() => PartVariantSpecWhereInputObjectSchema).optional()
}).strict();
export const PartVariantSpecUpsertWithoutVariantInputObjectSchema: z.ZodType<Prisma.PartVariantSpecUpsertWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecUpsertWithoutVariantInput>;
export const PartVariantSpecUpsertWithoutVariantInputObjectZodSchema = makeSchema();
