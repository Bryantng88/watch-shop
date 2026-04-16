import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './objects/MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './objects/MaintenanceRecordWhereInput.schema';

export const MaintenanceRecordUpdateManyAndReturnSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyAndReturnArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), data: MaintenanceRecordUpdateManyMutationInputObjectSchema, where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyAndReturnArgs>;

export const MaintenanceRecordUpdateManyAndReturnZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), data: MaintenanceRecordUpdateManyMutationInputObjectSchema, where: MaintenanceRecordWhereInputObjectSchema.optional() }).strict();