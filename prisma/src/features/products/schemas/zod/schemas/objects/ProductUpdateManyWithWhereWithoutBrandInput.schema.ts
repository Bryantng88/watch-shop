import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutBrandInputObjectSchema as ProductUncheckedUpdateManyWithoutBrandInputObjectSchema } from './ProductUncheckedUpdateManyWithoutBrandInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutBrandInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutBrandInput>;
export const ProductUpdateManyWithWhereWithoutBrandInputObjectZodSchema = makeSchema();
