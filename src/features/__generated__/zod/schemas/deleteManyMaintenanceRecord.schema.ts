import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './objects/MaintenanceRecordWhereInput.schema';

export const MaintenanceRecordDeleteManySchema: z.ZodType<Prisma.MaintenanceRecordDeleteManyArgs> = z.object({ where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordDeleteManyArgs>;

export const MaintenanceRecordDeleteManyZodSchema = z.object({ where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict();