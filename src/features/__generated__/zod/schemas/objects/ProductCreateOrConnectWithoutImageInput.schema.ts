import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutImageInputObjectSchema as ProductCreateWithoutImageInputObjectSchema } from './ProductCreateWithoutImageInput.schema';
import { ProductUncheckedCreateWithoutImageInputObjectSchema as ProductUncheckedCreateWithoutImageInputObjectSchema } from './ProductUncheckedCreateWithoutImageInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutImageInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutImageInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutImageInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutImageInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutImageInput>;
export const ProductCreateOrConnectWithoutImageInputObjectZodSchema = makeSchema();
