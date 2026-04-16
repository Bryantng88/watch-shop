import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductCategoryInputObjectSchema as ProductCreateWithoutProductCategoryInputObjectSchema } from './ProductCreateWithoutProductCategoryInput.schema';
import { ProductUncheckedCreateWithoutProductCategoryInputObjectSchema as ProductUncheckedCreateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutProductCategoryInput.schema';
import { ProductCreateOrConnectWithoutProductCategoryInputObjectSchema as ProductCreateOrConnectWithoutProductCategoryInputObjectSchema } from './ProductCreateOrConnectWithoutProductCategoryInput.schema';
import { ProductCreateManyProductCategoryInputEnvelopeObjectSchema as ProductCreateManyProductCategoryInputEnvelopeObjectSchema } from './ProductCreateManyProductCategoryInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutProductCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyProductCategoryInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedCreateNestedManyWithoutProductCategoryInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutProductCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutProductCategoryInput>;
export const ProductUncheckedCreateNestedManyWithoutProductCategoryInputObjectZodSchema = makeSchema();
