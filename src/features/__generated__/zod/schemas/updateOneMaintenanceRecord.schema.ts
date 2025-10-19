import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordUpdateInputObjectSchema as MaintenanceRecordUpdateInputObjectSchema } from './objects/MaintenanceRecordUpdateInput.schema';
import { MaintenanceRecordUncheckedUpdateInputObjectSchema as MaintenanceRecordUncheckedUpdateInputObjectSchema } from './objects/MaintenanceRecordUncheckedUpdateInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './objects/MaintenanceRecordWhereUniqueInput.schema';

export const MaintenanceRecordUpdateOneSchema: z.ZodType<Prisma.MaintenanceRecordUpdateArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), data: z.union([MaintenanceRecordUpdateInputObjectSchema, MaintenanceRecordUncheckedUpdateInputObjectSchema]), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateArgs>;

export const MaintenanceRecordUpdateOneZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), data: z.union([MaintenanceRecordUpdateInputObjectSchema, MaintenanceRecordUncheckedUpdateInputObjectSchema]), where: MaintenanceRecordWhereUniqueInputObjectSchema }).strict();