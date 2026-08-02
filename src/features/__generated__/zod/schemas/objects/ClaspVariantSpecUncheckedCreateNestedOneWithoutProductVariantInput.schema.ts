import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema as ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecUncheckedCreateWithoutProductVariantInput.schema';
import { ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema as ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema } from './ClaspVariantSpecCreateOrConnectWithoutProductVariantInput.schema';
import { ClaspVariantSpecWhereUniqueInputObjectSchema as ClaspVariantSpecWhereUniqueInputObjectSchema } from './ClaspVariantSpecWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ClaspVariantSpecCreateWithoutProductVariantInputObjectSchema), z.lazy(() => ClaspVariantSpecUncheckedCreateWithoutProductVariantInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ClaspVariantSpecCreateOrConnectWithoutProductVariantInputObjectSchema).optional(),
  connect: z.lazy(() => ClaspVariantSpecWhereUniqueInputObjectSchema).optional()
}).strict();
export const ClaspVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecUncheckedCreateNestedOneWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.ClaspVariantSpecUncheckedCreateNestedOneWithoutProductVariantInput>;
export const ClaspVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectZodSchema = makeSchema();
