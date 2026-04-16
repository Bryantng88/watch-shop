import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordCreateManyInputObjectSchema as MaintenanceRecordCreateManyInputObjectSchema } from './objects/MaintenanceRecordCreateManyInput.schema';

export const MaintenanceRecordCreateManySchema: z.ZodType<Prisma.MaintenanceRecordCreateManyArgs> = z.object({ data: z.union([ MaintenanceRecordCreateManyInputObjectSchema, z.array(MaintenanceRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateManyArgs>;

export const MaintenanceRecordCreateManyZodSchema = z.object({ data: z.union([ MaintenanceRecordCreateManyInputObjectSchema, z.array(MaintenanceRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();