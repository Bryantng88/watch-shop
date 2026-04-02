import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsCreateManyInputObjectSchema as maintenanceLogsCreateManyInputObjectSchema } from './objects/maintenanceLogsCreateManyInput.schema';

export const maintenanceLogsCreateManySchema: z.ZodType<Prisma.maintenanceLogsCreateManyArgs> = z.object({ data: z.union([ maintenanceLogsCreateManyInputObjectSchema, z.array(maintenanceLogsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsCreateManyArgs>;

export const maintenanceLogsCreateManyZodSchema = z.object({ data: z.union([ maintenanceLogsCreateManyInputObjectSchema, z.array(maintenanceLogsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();