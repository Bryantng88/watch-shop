import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordSelectObjectSchema as MaintenanceRecordSelectObjectSchema } from './objects/MaintenanceRecordSelect.schema';
import { MaintenanceRecordCreateManyInputObjectSchema as MaintenanceRecordCreateManyInputObjectSchema } from './objects/MaintenanceRecordCreateManyInput.schema';

export const MaintenanceRecordCreateManyAndReturnSchema: z.ZodType<Prisma.MaintenanceRecordCreateManyAndReturnArgs> = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), data: z.union([ MaintenanceRecordCreateManyInputObjectSchema, z.array(MaintenanceRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyAndReturnArgs>;

export const MaintenanceRecordCreateManyAndReturnZodSchema = z.object({ select: MaintenanceRecordSelectObjectSchema.optional(), data: z.union([ MaintenanceRecordCreateManyInputObjectSchema, z.array(MaintenanceRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();