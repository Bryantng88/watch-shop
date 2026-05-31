import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetScalarWhereInputObjectSchema as ProductPostTargetScalarWhereInputObjectSchema } from './ProductPostTargetScalarWhereInput.schema';
import { ProductPostTargetUpdateManyMutationInputObjectSchema as ProductPostTargetUpdateManyMutationInputObjectSchema } from './ProductPostTargetUpdateManyMutationInput.schema';
import { ProductPostTargetUncheckedUpdateManyWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedUpdateManyWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedUpdateManyWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductPostTargetUpdateManyMutationInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateManyWithoutPostTargetInputObjectSchema)])
}).strict();
export const ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateManyWithWhereWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyWithWhereWithoutPostTargetInput>;
export const ProductPostTargetUpdateManyWithWhereWithoutPostTargetInputObjectZodSchema = makeSchema();
