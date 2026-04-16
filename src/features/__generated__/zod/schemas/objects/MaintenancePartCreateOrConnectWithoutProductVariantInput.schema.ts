import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCreateWithoutProductVariantInputObjectSchema as MaintenancePartCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutProductVariantInput>;
export const MaintenancePartCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
