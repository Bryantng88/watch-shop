import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutServiceRequestInputObjectSchema as ProductUpdateWithoutServiceRequestInputObjectSchema } from './ProductUpdateWithoutServiceRequestInput.schema';
import { ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema as ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './ProductUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutServiceRequestInput>;
export const ProductUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
