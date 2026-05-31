import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithoutProductInputObjectSchema as ProductPostTargetUpdateWithoutProductInputObjectSchema } from './ProductPostTargetUpdateWithoutProductInput.schema';
import { ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema as ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedUpdateWithoutProductInput.schema';
import { ProductPostTargetCreateWithoutProductInputObjectSchema as ProductPostTargetCreateWithoutProductInputObjectSchema } from './ProductPostTargetCreateWithoutProductInput.schema';
import { ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema as ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductPostTargetUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpsertWithWhereUniqueWithoutProductInput>;
export const ProductPostTargetUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
