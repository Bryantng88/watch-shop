import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutVendorInputObjectSchema as ProductCreateWithoutVendorInputObjectSchema } from './ProductCreateWithoutVendorInput.schema';
import { ProductUncheckedCreateWithoutVendorInputObjectSchema as ProductUncheckedCreateWithoutVendorInputObjectSchema } from './ProductUncheckedCreateWithoutVendorInput.schema';
import { ProductCreateOrConnectWithoutVendorInputObjectSchema as ProductCreateOrConnectWithoutVendorInputObjectSchema } from './ProductCreateOrConnectWithoutVendorInput.schema';
import { ProductUpsertWithWhereUniqueWithoutVendorInputObjectSchema as ProductUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutVendorInput.schema';
import { ProductCreateManyVendorInputEnvelopeObjectSchema as ProductCreateManyVendorInputEnvelopeObjectSchema } from './ProductCreateManyVendorInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutVendorInputObjectSchema as ProductUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutVendorInput.schema';
import { ProductUpdateManyWithWhereWithoutVendorInputObjectSchema as ProductUpdateManyWithWhereWithoutVendorInputObjectSchema } from './ProductUpdateManyWithWhereWithoutVendorInput.schema';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutVendorInputObjectSchema), z.lazy(() => ProductCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutVendorNestedInput>;
export const ProductUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
