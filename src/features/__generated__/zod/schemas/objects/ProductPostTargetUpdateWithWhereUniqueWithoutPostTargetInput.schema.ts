import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithoutPostTargetInputObjectSchema as ProductPostTargetUpdateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUpdateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedUpdateWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductPostTargetUpdateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema)])
}).strict();
export const ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInput>;
export const ProductPostTargetUpdateWithWhereUniqueWithoutPostTargetInputObjectZodSchema = makeSchema();
