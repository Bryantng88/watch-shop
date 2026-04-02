import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './objects/maintenanceLogsInclude.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './objects/maintenanceLogsWhereUniqueInput.schema';

export const maintenanceLogsFindUniqueSchema: z.ZodType<Prisma.maintenanceLogsFindUniqueArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), where: maintenanceLogsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsFindUniqueArgs>;

export const maintenanceLogsFindUniqueZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), where: maintenanceLogsWhereUniqueInputObjectSchema }).strict();