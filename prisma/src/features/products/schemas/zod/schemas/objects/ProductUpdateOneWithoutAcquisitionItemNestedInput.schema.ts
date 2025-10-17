import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutAcquisitionItemInputObjectSchema as ProductCreateWithoutAcquisitionItemInputObjectSchema } from './ProductCreateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedCreateWithoutAcquisitionItemInput.schema';
import { ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema as ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema } from './ProductCreateOrConnectWithoutAcquisitionItemInput.schema';
import { ProductUpsertWithoutAcquisitionItemInputObjectSchema as ProductUpsertWithoutAcquisitionItemInputObjectSchema } from './ProductUpsertWithoutAcquisitionItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema as ProductUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutAcquisitionItemInput.schema';
import { ProductUpdateWithoutAcquisitionItemInputObjectSchema as ProductUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUpdateWithoutAcquisitionItemInput.schema';
import { ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './ProductUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutAcquisitionItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutAcquisitionItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutAcquisitionItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutAcquisitionItemNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutAcquisitionItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutAcquisitionItemNestedInput>;
export const ProductUpdateOneWithoutAcquisitionItemNestedInputObjectZodSchema = makeSchema();
