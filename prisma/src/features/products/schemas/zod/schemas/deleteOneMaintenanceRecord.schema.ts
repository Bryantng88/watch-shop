import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './objects/MaintenanceRecordWhereUniqueInput.schema';

export const MaintenanceRecordDeleteOneSchema: z.ZodType<Prisma.MaintenanceRecordDeleteArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordDeleteArgs>;

export const MaintenanceRecordDeleteOneZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict();