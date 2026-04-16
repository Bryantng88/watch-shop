import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutVariantInputObjectSchema as MaintenancePartCreateWithoutVariantInputObjectSchema } from './MaintenancePartCreateWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutVariantInput.schema';
import { MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema as MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutVariantInput.schema';
import { MaintenancePartCreateManyVariantInputEnvelopeObjectSchema as MaintenancePartCreateManyVariantInputEnvelopeObjectSchema } from './MaintenancePartCreateManyVariantInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartCreateNestedManyWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateNestedManyWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateNestedManyWithoutVariantInput>;
export const MaintenancePartCreateNestedManyWithoutVariantInputObjectZodSchema = makeSchema();
