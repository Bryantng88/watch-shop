import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutMaintenancePartInputObjectSchema as ProductVariantCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenancePartInput.schema';
import { ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema as ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateOrConnectWithoutMaintenancePartInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutMaintenancePartInput>;
export const ProductVariantCreateNestedOneWithoutMaintenancePartInputObjectZodSchema = makeSchema();
