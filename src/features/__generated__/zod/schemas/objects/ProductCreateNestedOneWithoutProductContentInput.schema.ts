import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductContentInputObjectSchema as ProductCreateWithoutProductContentInputObjectSchema } from './ProductCreateWithoutProductContentInput.schema';
import { ProductUncheckedCreateWithoutProductContentInputObjectSchema as ProductUncheckedCreateWithoutProductContentInputObjectSchema } from './ProductUncheckedCreateWithoutProductContentInput.schema';
import { ProductCreateOrConnectWithoutProductContentInputObjectSchema as ProductCreateOrConnectWithoutProductContentInputObjectSchema } from './ProductCreateOrConnectWithoutProductContentInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductContentInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductContentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutProductContentInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutProductContentInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutProductContentInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutProductContentInput>;
export const ProductCreateNestedOneWithoutProductContentInputObjectZodSchema = makeSchema();
