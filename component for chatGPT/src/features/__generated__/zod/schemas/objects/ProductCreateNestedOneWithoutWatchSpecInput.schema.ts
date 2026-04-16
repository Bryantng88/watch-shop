import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutWatchSpecInputObjectSchema as ProductCreateWithoutWatchSpecInputObjectSchema } from './ProductCreateWithoutWatchSpecInput.schema';
import { ProductUncheckedCreateWithoutWatchSpecInputObjectSchema as ProductUncheckedCreateWithoutWatchSpecInputObjectSchema } from './ProductUncheckedCreateWithoutWatchSpecInput.schema';
import { ProductCreateOrConnectWithoutWatchSpecInputObjectSchema as ProductCreateOrConnectWithoutWatchSpecInputObjectSchema } from './ProductCreateOrConnectWithoutWatchSpecInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutWatchSpecInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutWatchSpecInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutWatchSpecInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutWatchSpecInput>;
export const ProductCreateNestedOneWithoutWatchSpecInputObjectZodSchema = makeSchema();
