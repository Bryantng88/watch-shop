import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductImageInputObjectSchema as ProductCreateWithoutProductImageInputObjectSchema } from './ProductCreateWithoutProductImageInput.schema';
import { ProductUncheckedCreateWithoutProductImageInputObjectSchema as ProductUncheckedCreateWithoutProductImageInputObjectSchema } from './ProductUncheckedCreateWithoutProductImageInput.schema';
import { ProductCreateOrConnectWithoutProductImageInputObjectSchema as ProductCreateOrConnectWithoutProductImageInputObjectSchema } from './ProductCreateOrConnectWithoutProductImageInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductImageInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductImageInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutProductImageInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutProductImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutProductImageInput>;
export const ProductCreateNestedOneWithoutProductImageInputObjectZodSchema = makeSchema();
