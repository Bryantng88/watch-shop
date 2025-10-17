import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './MaintenancePartWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => MaintenancePartWhereInputObjectSchema).optional(),
  some: z.lazy(() => MaintenancePartWhereInputObjectSchema).optional(),
  none: z.lazy(() => MaintenancePartWhereInputObjectSchema).optional()
}).strict();
export const MaintenancePartListRelationFilterObjectSchema: z.ZodType<Prisma.MaintenancePartListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartListRelationFilter>;
export const MaintenancePartListRelationFilterObjectZodSchema = makeSchema();
