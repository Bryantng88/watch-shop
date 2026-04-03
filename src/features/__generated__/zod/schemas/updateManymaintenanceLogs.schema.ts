import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsUpdateManyMutationInputObjectSchema as maintenanceLogsUpdateManyMutationInputObjectSchema } from './objects/maintenanceLogsUpdateManyMutationInput.schema';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './objects/maintenanceLogsWhereInput.schema';

export const maintenanceLogsUpdateManySchema: z.ZodType<Prisma.maintenanceLogsUpdateManyArgs> = z.object({ data: maintenanceLogsUpdateManyMutationInputObjectSchema, where: maintenanceLogsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyArgs>;

export const maintenanceLogsUpdateManyZodSchema = z.object({ data: maintenanceLogsUpdateManyMutationInputObjectSchema, where: maintenanceLogsWhereInputObjectSchema.optional() }).strict();