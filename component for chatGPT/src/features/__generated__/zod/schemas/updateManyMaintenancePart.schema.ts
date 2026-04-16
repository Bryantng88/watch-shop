import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './objects/MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './objects/MaintenancePartWhereInput.schema';

export const MaintenancePartUpdateManySchema: z.ZodType<Prisma.MaintenancePartUpdateManyArgs> = z.object({ data: MaintenancePartUpdateManyMutationInputObjectSchema, where: MaintenancePartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyArgs>;

export const MaintenancePartUpdateManyZodSchema = z.object({ data: MaintenancePartUpdateManyMutationInputObjectSchema, where: MaintenancePartWhereInputObjectSchema.optional() }).strict();