import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './ClaspVariantSpecWhereUniqueInput.schema';
import { ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClaspVariantSpecWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecCreateOrConnectWithoutProductVariantInput>;
export const ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
