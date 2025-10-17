import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutMaintenancePartInputObjectSchema as ProductVariantCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedCreateWithoutMaintenancePartInput.schema';
import { ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema as ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema } from './ProductVariantCreateOrConnectWithoutMaintenancePartInput.schema';
import { ProductVariantUpsertWithoutMaintenancePartInputObjectSchema as ProductVariantUpsertWithoutMaintenancePartInputObjectSchema } from './ProductVariantUpsertWithoutMaintenancePartInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInput.schema';
import { ProductVariantUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUpdateWithoutMaintenancePartInput.schema';
import { ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema as ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutMaintenancePartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutMaintenancePartInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutMaintenancePartInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutMaintenancePartInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneWithoutMaintenancePartNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneWithoutMaintenancePartNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneWithoutMaintenancePartNestedInput>;
export const ProductVariantUpdateOneWithoutMaintenancePartNestedInputObjectZodSchema = makeSchema();
