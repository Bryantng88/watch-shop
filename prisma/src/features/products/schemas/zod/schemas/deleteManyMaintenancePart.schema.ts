import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './objects/MaintenancePartWhereInput.schema';

export const MaintenancePartDeleteManySchema: z.ZodType<Prisma.MaintenancePartDeleteManyArgs> = z.object({ where: MaintenancePartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartDeleteManyArgs>;

export const MaintenancePartDeleteManyZodSchema = z.object({ where: MaintenancePartWhereInputObjectSchema.optional() }).strict();