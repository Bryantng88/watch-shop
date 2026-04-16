import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutProductContentInputObjectSchema as ProductCreateWithoutProductContentInputObjectSchema } from './ProductCreateWithoutProductContentInput.schema';
import { ProductUncheckedCreateWithoutProductContentInputObjectSchema as ProductUncheckedCreateWithoutProductContentInputObjectSchema } from './ProductUncheckedCreateWithoutProductContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductContentInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutProductContentInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProductContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutProductContentInput>;
export const ProductCreateOrConnectWithoutProductContentInputObjectZodSchema = makeSchema();
