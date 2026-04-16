import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutWatchInputObjectSchema as ProductCreateWithoutWatchInputObjectSchema } from './ProductCreateWithoutWatchInput.schema';
import { ProductUncheckedCreateWithoutWatchInputObjectSchema as ProductUncheckedCreateWithoutWatchInputObjectSchema } from './ProductUncheckedCreateWithoutWatchInput.schema';
import { ProductCreateOrConnectWithoutWatchInputObjectSchema as ProductCreateOrConnectWithoutWatchInputObjectSchema } from './ProductCreateOrConnectWithoutWatchInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutWatchInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutWatchInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutWatchInput>;
export const ProductCreateNestedOneWithoutWatchInputObjectZodSchema = makeSchema();
