import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutProductImageInputObjectSchema as ProductCreateWithoutProductImageInputObjectSchema } from './ProductCreateWithoutProductImageInput.schema';
import { ProductUncheckedCreateWithoutProductImageInputObjectSchema as ProductUncheckedCreateWithoutProductImageInputObjectSchema } from './ProductUncheckedCreateWithoutProductImageInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductImageInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutProductImageInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutProductImageInput>;
export const ProductCreateOrConnectWithoutProductImageInputObjectZodSchema = makeSchema();
