import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './objects/maintenanceLogsWhereInput.schema';

export const maintenanceLogsDeleteManySchema: z.ZodType<Prisma.maintenanceLogsDeleteManyArgs> = z.object({ where: maintenanceLogsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsDeleteManyArgs>;

export const maintenanceLogsDeleteManyZodSchema = z.object({ where: maintenanceLogsWhereInputObjectSchema.optional() }).strict();