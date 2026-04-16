import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutProductVariantInputObjectSchema as MaintenancePartCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutProductVariantInput.schema';
import { MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema as MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutProductVariantInput.schema';
import { MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema as MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema } from './MaintenancePartCreateManyProductVariantInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInput>;
export const MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInputObjectZodSchema = makeSchema();
