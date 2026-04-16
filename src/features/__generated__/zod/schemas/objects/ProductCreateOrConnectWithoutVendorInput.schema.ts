import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutVendorInputObjectSchema as ProductCreateWithoutVendorInputObjectSchema } from './ProductCreateWithoutVendorInput.schema';
import { ProductUncheckedCreateWithoutVendorInputObjectSchema as ProductUncheckedCreateWithoutVendorInputObjectSchema } from './ProductUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutVendorInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutVendorInput>;
export const ProductCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
