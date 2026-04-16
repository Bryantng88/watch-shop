import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCreateWithoutVariantInputObjectSchema as MaintenancePartCreateWithoutVariantInputObjectSchema } from './MaintenancePartCreateWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutVariantInput>;
export const MaintenancePartCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();
