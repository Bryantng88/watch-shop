import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutMaintenancePartInputObjectSchema as ProductVariantCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutMaintenancePartInput>;
export const ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectZodSchema = makeSchema();
