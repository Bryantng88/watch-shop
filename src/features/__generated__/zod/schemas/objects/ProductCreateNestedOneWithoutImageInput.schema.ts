import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutImageInputObjectSchema as ProductCreateWithoutImageInputObjectSchema } from './ProductCreateWithoutImageInput.schema';
import { ProductUncheckedCreateWithoutImageInputObjectSchema as ProductUncheckedCreateWithoutImageInputObjectSchema } from './ProductUncheckedCreateWithoutImageInput.schema';
import { ProductCreateOrConnectWithoutImageInputObjectSchema as ProductCreateOrConnectWithoutImageInputObjectSchema } from './ProductCreateOrConnectWithoutImageInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutImageInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutImageInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutImageInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutImageInput>;
export const ProductCreateNestedOneWithoutImageInputObjectZodSchema = makeSchema();
