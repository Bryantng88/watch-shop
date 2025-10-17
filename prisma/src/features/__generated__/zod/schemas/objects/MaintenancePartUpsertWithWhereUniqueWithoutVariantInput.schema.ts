import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutVariantInputObjectSchema as MaintenancePartUpdateWithoutVariantInputObjectSchema } from './MaintenancePartUpdateWithoutVariantInput.schema';
import { MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema as MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutVariantInput.schema';
import { MaintenancePartCreateWithoutVariantInputObjectSchema as MaintenancePartCreateWithoutVariantInputObjectSchema } from './MaintenancePartCreateWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutVariantInput>;
export const MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
