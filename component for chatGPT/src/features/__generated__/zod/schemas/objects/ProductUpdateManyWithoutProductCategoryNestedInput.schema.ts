import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutProductCategoryInputObjectSchema as ProductCreateWithoutProductCategoryInputObjectSchema } from './ProductCreateWithoutProductCategoryInput.schema';
import { ProductUncheckedCreateWithoutProductCategoryInputObjectSchema as ProductUncheckedCreateWithoutProductCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutProductCategoryInput.schema';
import { ProductCreateOrConnectWithoutProductCategoryInputObjectSchema as ProductCreateOrConnectWithoutProductCategoryInputObjectSchema } from './ProductCreateOrConnectWithoutProductCategoryInput.schema';
import { ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectSchema as ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutProductCategoryInput.schema';
import { ProductCreateManyProductCategoryInputEnvelopeObjectSchema as ProductCreateManyProductCategoryInputEnvelopeObjectSchema } from './ProductCreateManyProductCategoryInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectSchema as ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutProductCategoryInput.schema';
import { ProductUpdateManyWithWhereWithoutProductCategoryInputObjectSchema as ProductUpdateManyWithWhereWithoutProductCategoryInputObjectSchema } from './ProductUpdateManyWithWhereWithoutProductCategoryInput.schema';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductCreateWithoutProductCategoryInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutProductCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutProductCategoryInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutProductCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyProductCategoryInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutProductCategoryInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutProductCategoryInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutProductCategoryInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUpdateManyWithoutProductCategoryNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithoutProductCategoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithoutProductCategoryNestedInput>;
export const ProductUpdateManyWithoutProductCategoryNestedInputObjectZodSchema = makeSchema();
