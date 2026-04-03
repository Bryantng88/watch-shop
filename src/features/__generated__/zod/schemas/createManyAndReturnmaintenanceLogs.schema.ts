import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsCreateManyInputObjectSchema as maintenanceLogsCreateManyInputObjectSchema } from './objects/maintenanceLogsCreateManyInput.schema';

export const maintenanceLogsCreateManyAndReturnSchema: z.ZodType<Prisma.maintenanceLogsCreateManyAndReturnArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), data: z.union([ maintenanceLogsCreateManyInputObjectSchema, z.array(maintenanceLogsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsCreateManyAndReturnArgs>;

export const maintenanceLogsCreateManyAndReturnZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), data: z.union([ maintenanceLogsCreateManyInputObjectSchema, z.array(maintenanceLogsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();