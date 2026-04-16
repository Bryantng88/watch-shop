import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutBrandInputObjectSchema as ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema as ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema';
import { ProductCreateOrConnectWithoutBrandInputObjectSchema as ProductCreateOrConnectWithoutBrandInputObjectSchema } from './ProductCreateOrConnectWithoutBrandInput.schema';
import { ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema as ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutBrandInput.schema';
import { ProductCreateManyBrandInputEnvelopeObjectSchema as ProductCreateManyBrandInputEnvelopeObjectSchema } from './ProductCreateManyBrandInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema as ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutBrandInput.schema';
import { ProductUpdateManyWithWhereWithoutBrandInputObjectSchema as ProductUpdateManyWithWhereWithoutBrandInputObjectSchema } from './ProductUpdateManyWithWhereWithoutBrandInput.schema';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateWithoutBrandInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyBrandInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutBrandInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutBrandInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedUpdateManyWithoutBrandNestedInputObjectSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutBrandNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutBrandNestedInput>;
export const ProductUncheckedUpdateManyWithoutBrandNestedInputObjectZodSchema = makeSchema();
