import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartCreateManyInputObjectSchema as MaintenancePartCreateManyInputObjectSchema } from './objects/MaintenancePartCreateManyInput.schema';

export const MaintenancePartCreateManyAndReturnSchema: z.ZodType<Prisma.MaintenancePartCreateManyAndReturnArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), data: z.union([ MaintenancePartCreateManyInputObjectSchema, z.array(MaintenancePartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyAndReturnArgs>;

export const MaintenancePartCreateManyAndReturnZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), data: z.union([ MaintenancePartCreateManyInputObjectSchema, z.array(MaintenancePartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();