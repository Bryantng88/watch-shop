import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithoutProductInputObjectSchema as ProductPostTargetUpdateWithoutProductInputObjectSchema } from './ProductPostTargetUpdateWithoutProductInput.schema';
import { ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema as ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductPostTargetUpdateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateWithWhereUniqueWithoutProductInput>;
export const ProductPostTargetUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
