import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutProductVariantInputObjectSchema as MaintenancePartUpdateWithoutProductVariantInputObjectSchema } from './MaintenancePartUpdateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutProductVariantInput.schema';
import { MaintenancePartCreateWithoutProductVariantInputObjectSchema as MaintenancePartCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInput>;
export const MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
