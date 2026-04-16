import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutContentInputObjectSchema as ProductCreateWithoutContentInputObjectSchema } from './ProductCreateWithoutContentInput.schema';
import { ProductUncheckedCreateWithoutContentInputObjectSchema as ProductUncheckedCreateWithoutContentInputObjectSchema } from './ProductUncheckedCreateWithoutContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutContentInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutContentInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutContentInput>;
export const ProductCreateOrConnectWithoutContentInputObjectZodSchema = makeSchema();
