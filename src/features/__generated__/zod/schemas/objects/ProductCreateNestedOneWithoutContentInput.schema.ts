import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutContentInputObjectSchema as ProductCreateWithoutContentInputObjectSchema } from './ProductCreateWithoutContentInput.schema';
import { ProductUncheckedCreateWithoutContentInputObjectSchema as ProductUncheckedCreateWithoutContentInputObjectSchema } from './ProductUncheckedCreateWithoutContentInput.schema';
import { ProductCreateOrConnectWithoutContentInputObjectSchema as ProductCreateOrConnectWithoutContentInputObjectSchema } from './ProductCreateOrConnectWithoutContentInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutContentInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutContentInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutContentInput>;
export const ProductCreateNestedOneWithoutContentInputObjectZodSchema = makeSchema();
