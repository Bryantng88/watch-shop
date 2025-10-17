import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductImageScalarWhereInputObjectSchema as ProductImageScalarWhereInputObjectSchema } from './ProductImageScalarWhereInput.schema';
import { ProductImageUpdateManyMutationInputObjectSchema as ProductImageUpdateManyMutationInputObjectSchema } from './ProductImageUpdateManyMutationInput.schema';
import { ProductImageUncheckedUpdateManyWithoutProductInputObjectSchema as ProductImageUncheckedUpdateManyWithoutProductInputObjectSchema } from './ProductImageUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductImageScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductImageUpdateManyMutationInputObjectSchema), z.lazy(() => ProductImageUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ProductImageUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductImageUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductImageUpdateManyWithWhereWithoutProductInput>;
export const ProductImageUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
