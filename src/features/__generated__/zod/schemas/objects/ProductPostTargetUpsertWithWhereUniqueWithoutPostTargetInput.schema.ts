import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetUpdateWithoutPostTargetInputObjectSchema as ProductPostTargetUpdateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUpdateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedUpdateWithoutPostTargetInput.schema';
import { ProductPostTargetCreateWithoutPostTargetInputObjectSchema as ProductPostTargetCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetCreateWithoutPostTargetInput.schema';
import { ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema as ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutPostTargetInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductPostTargetUpdateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedUpdateWithoutPostTargetInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutPostTargetInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutPostTargetInputObjectSchema)])
}).strict();
export const ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInput>;
export const ProductPostTargetUpsertWithWhereUniqueWithoutPostTargetInputObjectZodSchema = makeSchema();
