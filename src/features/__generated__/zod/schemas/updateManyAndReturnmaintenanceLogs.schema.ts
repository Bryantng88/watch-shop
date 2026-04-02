import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsUpdateManyMutationInputObjectSchema as maintenanceLogsUpdateManyMutationInputObjectSchema } from './objects/maintenanceLogsUpdateManyMutationInput.schema';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './objects/maintenanceLogsWhereInput.schema';

export const maintenanceLogsUpdateManyAndReturnSchema: z.ZodType<Prisma.maintenanceLogsUpdateManyAndReturnArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), data: maintenanceLogsUpdateManyMutationInputObjectSchema, where: maintenanceLogsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyAndReturnArgs>;

export const maintenanceLogsUpdateManyAndReturnZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), data: maintenanceLogsUpdateManyMutationInputObjectSchema, where: maintenanceLogsWhereInputObjectSchema.optional() }).strict();