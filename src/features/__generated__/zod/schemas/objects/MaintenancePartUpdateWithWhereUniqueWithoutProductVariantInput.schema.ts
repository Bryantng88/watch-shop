import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutProductVariantInputObjectSchema as MaintenancePartUpdateWithoutProductVariantInputObjectSchema } from './MaintenancePartUpdateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInput>;
export const MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
