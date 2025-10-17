import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutVariantInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutVariantInput>;
export const MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectZodSchema = makeSchema();
