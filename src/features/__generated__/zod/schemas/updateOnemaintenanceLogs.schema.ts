import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './objects/maintenanceLogsInclude.schema';
import { maintenanceLogsUpdateInputObjectSchema as maintenanceLogsUpdateInputObjectSchema } from './objects/maintenanceLogsUpdateInput.schema';
import { maintenanceLogsUncheckedUpdateInputObjectSchema as maintenanceLogsUncheckedUpdateInputObjectSchema } from './objects/maintenanceLogsUncheckedUpdateInput.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './objects/maintenanceLogsWhereUniqueInput.schema';

export const maintenanceLogsUpdateOneSchema: z.ZodType<Prisma.maintenanceLogsUpdateArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), data: z.union([maintenanceLogsUpdateInputObjectSchema, maintenanceLogsUncheckedUpdateInputObjectSchema]), where: maintenanceLogsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateArgs>;

export const maintenanceLogsUpdateOneZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), data: z.union([maintenanceLogsUpdateInputObjectSchema, maintenanceLogsUncheckedUpdateInputObjectSchema]), where: maintenanceLogsWhereUniqueInputObjectSchema }).strict();