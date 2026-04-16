import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutWatchInputObjectSchema as ProductCreateWithoutWatchInputObjectSchema } from './ProductCreateWithoutWatchInput.schema';
import { ProductUncheckedCreateWithoutWatchInputObjectSchema as ProductUncheckedCreateWithoutWatchInputObjectSchema } from './ProductUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutWatchInput>;
export const ProductCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
