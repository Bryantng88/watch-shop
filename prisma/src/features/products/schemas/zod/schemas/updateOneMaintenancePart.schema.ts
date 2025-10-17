import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './objects/MaintenancePartInclude.schema';
import { MaintenancePartUpdateInputObjectSchema as MaintenancePartUpdateInputObjectSchema } from './objects/MaintenancePartUpdateInput.schema';
import { MaintenancePartUncheckedUpdateInputObjectSchema as MaintenancePartUncheckedUpdateInputObjectSchema } from './objects/MaintenancePartUncheckedUpdateInput.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './objects/MaintenancePartWhereUniqueInput.schema';

export const MaintenancePartUpdateOneSchema: z.ZodType<Prisma.MaintenancePartUpdateArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), data: z.union([MaintenancePartUpdateInputObjectSchema, MaintenancePartUncheckedUpdateInputObjectSchema]), where: MaintenancePartWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MaintenancePartUpdateArgs>;

export const MaintenancePartUpdateOneZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), data: z.union([MaintenancePartUpdateInputObjectSchema, MaintenancePartUncheckedUpdateInputObjectSchema]), where: MaintenancePartWhereUniqueInputObjectSchema }).strict();