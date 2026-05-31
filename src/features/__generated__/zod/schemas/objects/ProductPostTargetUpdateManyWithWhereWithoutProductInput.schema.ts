import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetScalarWhereInputObjectSchema as ProductPostTargetScalarWhereInputObjectSchema } from './ProductPostTargetScalarWhereInput.schema';
import { ProductPostTargetUpdateManyMutationInputObjectSchema as ProductPostTargetUpdateManyMutationInputObjectSchema } from './ProductPostTargetUpdateManyMutationInput.schema';
import { ProductPostTargetUncheckedUpdateManyWithoutProductInputObjectSchema as ProductPostTargetUncheckedUpdateManyWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductPostTargetUpdateManyMutationInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyWithWhereWithoutProductInput>;
export const ProductPostTargetUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
