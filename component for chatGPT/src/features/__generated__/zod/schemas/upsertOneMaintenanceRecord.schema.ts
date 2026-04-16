import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './objects/MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateInputObjectSchema as MaintenanceRecordCreateInputObjectSchema } from './objects/MaintenanceRecordCreateInput.schema';
import { MaintenanceRecordUncheckedCreateInputObjectSchema as MaintenanceRecordUncheckedCreateInputObjectSchema } from './objects/MaintenanceRecordUncheckedCreateInput.schema';
import { MaintenanceRecordUpdateInputObjectSchema as MaintenanceRecordUpdateInputObjectSchema } from './objects/MaintenanceRecordUpdateInput.schema';
import { MaintenanceRecordUncheckedUpdateInputObjectSchema as MaintenanceRecordUncheckedUpdateInputObjectSchema } from './objects/MaintenanceRecordUncheckedUpdateInput.schema';

export const MaintenanceRecordUpsertOneSchema: z.ZodType<Prisma.MaintenanceRecordUpsertArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema, create: z.union([ MaintenanceRecordCreateInputObjectSchema, MaintenanceRecordUncheckedCreateInputObjectSchema ]), update: z.union([ MaintenanceRecordUpdateInputObjectSchema, MaintenanceRecordUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertArgs>;

export const MaintenanceRecordUpsertOneZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), where: MaintenanceRecordWhereUniqueInputObjectSchema, create: z.union([ MaintenanceRecordCreateInputObjectSchema, MaintenanceRecordUncheckedCreateInputObjectSchema ]), update: z.union([ MaintenanceRecordUpdateInputObjectSchema, MaintenanceRecordUncheckedUpdateInputObjectSchema ]) }).strict();