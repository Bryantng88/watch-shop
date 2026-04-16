import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutProductVariantInput.schema';
import { StrapVariantSpecCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => StrapVariantSpecUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]),
  where: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecUpsertWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpsertWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpsertWithoutProductVariantInput>;
export const StrapVariantSpecUpsertWithoutProductVariantInputObjectZodSchema = makeSchema();
