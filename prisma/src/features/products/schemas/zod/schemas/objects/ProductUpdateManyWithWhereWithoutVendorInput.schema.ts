import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutVendorInputObjectSchema as ProductUncheckedUpdateManyWithoutVendorInputObjectSchema } from './ProductUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutVendorInput>;
export const ProductUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
