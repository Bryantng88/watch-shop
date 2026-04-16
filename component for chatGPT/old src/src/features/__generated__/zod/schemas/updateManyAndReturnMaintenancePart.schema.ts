import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './objects/MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './objects/MaintenancePartWhereInput.schema';

export const MaintenancePartUpdateManyAndReturnSchema: z.ZodType<Prisma.MaintenancePartUpdateManyAndReturnArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), data: MaintenancePartUpdateManyMutationInputObjectSchema, where: MaintenancePartWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyAndReturnArgs>;

export const MaintenancePartUpdateManyAndReturnZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), data: MaintenancePartUpdateManyMutationInputObjectSchema, where: MaintenancePartWhereInputObjectSchema.optional() }).strict();