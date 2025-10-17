import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordCreateInputObjectSchema as MaintenanceRecordCreateInputObjectSchema } from './objects/MaintenanceRecordCreateInput.schema';
import { MaintenanceRecordUncheckedCreateInputObjectSchema as MaintenanceRecordUncheckedCreateInputObjectSchema } from './objects/MaintenanceRecordUncheckedCreateInput.schema';

export const MaintenanceRecordCreateOneSchema: z.ZodType<Prisma.MaintenanceRecordCreateArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), data: z.union([MaintenanceRecordCreateInputObjectSchema, MaintenanceRecordUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateArgs>;

export const MaintenanceRecordCreateOneZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), data: z.union([MaintenanceRecordCreateInputObjectSchema, MaintenanceRecordUncheckedCreateInputObjectSchema]) }).strict();