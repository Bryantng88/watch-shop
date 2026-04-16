import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapVariantSpecWhereUniqueInputObjectSchema as StrapVariantSpecWhereUniqueInputObjectSchema } from './StrapVariantSpecWhereUniqueInput.schema';
import { StrapVariantSpecCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => StrapVariantSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StrapVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => StrapVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.StrapVariantSpecCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecCreateOrConnectWithoutProductVariantInput>;
export const StrapVariantSpecCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
