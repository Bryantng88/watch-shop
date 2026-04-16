import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartCreateManyInputObjectSchema as MaintenancePartCreateManyInputObjectSchema } from './objects/MaintenancePartCreateManyInput.schema';

export const MaintenancePartCreateManySchema: z.ZodType<Prisma.MaintenancePartCreateManyArgs> = z.object({ data: z.union([ MaintenancePartCreateManyInputObjectSchema, z.array(MaintenancePartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartCreateManyArgs>;

export const MaintenancePartCreateManyZodSchema = z.object({ data: z.union([ MaintenancePartCreateManyInputObjectSchema, z.array(MaintenancePartCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();