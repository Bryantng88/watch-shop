import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './ProductImageWhereUniqueInput.schema';
import { ProductImageCreateWithoutProductInputObjectSchema as ProductImageCreateWithoutProductInputObjectSchema } from './ProductImageCreateWithoutProductInput.schema';
import { ProductImageUncheckedCreateWithoutProductInputObjectSchema as ProductImageUncheckedCreateWithoutProductInputObjectSchema } from './ProductImageUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductImageWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductImageCreateWithoutProductInputObjectSchema), z.lazy(() => ProductImageUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ProductImageCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductImageCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageCreateOrConnectWithoutProductInput>;
export const ProductImageCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
