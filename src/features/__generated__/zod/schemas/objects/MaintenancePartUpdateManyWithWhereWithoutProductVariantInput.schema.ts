import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutProductVariantInput>;
export const MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
