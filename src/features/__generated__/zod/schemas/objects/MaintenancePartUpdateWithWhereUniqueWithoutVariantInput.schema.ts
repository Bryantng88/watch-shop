import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutVariantInputObjectSchema as MaintenancePartUpdateWithoutVariantInputObjectSchema } from './MaintenancePartUpdateWithoutVariantInput.schema';
import { MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema as MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutVariantInput>;
export const MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
