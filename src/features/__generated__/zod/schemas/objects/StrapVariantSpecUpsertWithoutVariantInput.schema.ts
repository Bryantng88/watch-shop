import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUpdateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedUpdateWithoutVariantInput.schema';
import { StrapVariantSpecCreateWithoutVariantInputObjectSchema as StrapVariantSpecCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutVariantInput.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => StrapVariantSpecUpdateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutVariantInputObjectSchema)]),
  where: z.lazy(() => StrapVariantSpecWhereInputObjectSchema).optional()
}).strict();
export const StrapVariantSpecUpsertWithoutVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecUpsertWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecUpsertWithoutVariantInput>;
export const StrapVariantSpecUpsertWithoutVariantInputObjectZodSchema = makeSchema();
