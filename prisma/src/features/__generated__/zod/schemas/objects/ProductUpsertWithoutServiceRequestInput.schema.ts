import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutServiceRequestInputObjectSchema as ProductUpdateWithoutServiceRequestInputObjectSchema } from './ProductUpdateWithoutServiceRequestInput.schema';
import { ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedUpdateWithoutServiceRequestInput.schema';
import { ProductCreateWithoutServiceRequestInputObjectSchema as ProductCreateWithoutServiceRequestInputObjectSchema } from './ProductCreateWithoutServiceRequestInput.schema';
import { ProductUncheckedCreateWithoutServiceRequestInputObjectSchema as ProductUncheckedCreateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedCreateWithoutServiceRequestInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutServiceRequestInput>;
export const ProductUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
