import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductPostTargetWhereUniqueInputObjectSchema as ProductPostTargetWhereUniqueInputObjectSchema } from './ProductPostTargetWhereUniqueInput.schema';
import { ProductPostTargetCreateWithoutProductInputObjectSchema as ProductPostTargetCreateWithoutProductInputObjectSchema } from './ProductPostTargetCreateWithoutProductInput.schema';
import { ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema as ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema } from './ProductPostTargetUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductPostTargetWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductPostTargetCreateWithoutProductInputObjectSchema), z.lazy(() => ProductPostTargetUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductPostTargetCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductPostTargetCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetCreateOrConnectWithoutProductInput>;
export const ProductPostTargetCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
