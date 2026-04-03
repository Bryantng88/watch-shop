import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './objects/maintenanceLogsInclude.schema';
import { maintenanceLogsCreateInputObjectSchema as maintenanceLogsCreateInputObjectSchema } from './objects/maintenanceLogsCreateInput.schema';
import { maintenanceLogsUncheckedCreateInputObjectSchema as maintenanceLogsUncheckedCreateInputObjectSchema } from './objects/maintenanceLogsUncheckedCreateInput.schema';

export const maintenanceLogsCreateOneSchema: z.ZodType<Prisma.maintenanceLogsCreateArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), data: z.union([maintenanceLogsCreateInputObjectSchema, maintenanceLogsUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsCreateArgs>;

export const maintenanceLogsCreateOneZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), data: z.union([maintenanceLogsCreateInputObjectSchema, maintenanceLogsUncheckedCreateInputObjectSchema]) }).strict();