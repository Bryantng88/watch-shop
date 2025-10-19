import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutWatchSpecInputObjectSchema as ProductCreateWithoutWatchSpecInputObjectSchema } from './ProductCreateWithoutWatchSpecInput.schema';
import { ProductUncheckedCreateWithoutWatchSpecInputObjectSchema as ProductUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedCreateWithoutWatchSpecInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchSpecInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutWatchSpecInput>;
export const ProductCreateOrConnectWithoutWatchSpecInputObjectZodSchema = makeSchema();
