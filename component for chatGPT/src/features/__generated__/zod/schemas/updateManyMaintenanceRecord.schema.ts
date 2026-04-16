import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './objects/MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './objects/MaintenanceRecordWhereInput.schema';

export const MaintenanceRecordUpdateManySchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyArgs> = z.object({ data: MaintenanceRecordUpdateManyMutationInputObjectSchema, where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyArgs>;

export const MaintenanceRecordUpdateManyZodSchema = z.object({ data: MaintenanceRecordUpdateManyMutationInputObjectSchema, where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict();