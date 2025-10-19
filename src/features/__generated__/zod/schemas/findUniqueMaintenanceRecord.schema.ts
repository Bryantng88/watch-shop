import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './objects/MaintenanceRecordWhereUniqueInput.schema';

export const MaintenanceRecordFindUniqueSchema: z.ZodType<Prisma.MaintenanceRecordFindUniqueArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordFindUniqueArgs>;

export const MaintenanceRecordFindUniqueZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict();