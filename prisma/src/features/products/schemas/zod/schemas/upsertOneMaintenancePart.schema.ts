import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './objects/MaintenancePartInclude.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './objects/MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCreateInputObjectSchema as MaintenancePartCreateInputObjectSchema } from './objects/MaintenancePartCreateInput.schema';
import { MaintenancePartUncheckedCreateInputObjectSchema as MaintenancePartUncheckedCreateInputObjectSchema } from './objects/MaintenancePartUncheckedCreateInput.schema';
import { MaintenancePartUpdateInputObjectSchema as MaintenancePartUpdateInputObjectSchema } from './objects/MaintenancePartUpdateInput.schema';
import { MaintenancePartUncheckedUpdateInputObjectSchema as MaintenancePartUncheckedUpdateInputObjectSchema } from './objects/MaintenancePartUncheckedUpdateInput.schema';

export const MaintenancePartUpsertOneSchema: z.ZodType<Prisma.MaintenancePartUpsertArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), where: MaintenancePartWhereUniqueInputObjectSchema, create: z.union([ MaintenancePartCreateInputObjectSchema, MaintenancePartUncheckedCreateInputObjectSchema ]), update: z.union([ MaintenancePartUpdateInputObjectSchema, MaintenancePartUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.MaintenancePartUpsertArgs>;

export const MaintenancePartUpsertOneZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), where: MaintenancePartWhereUniqueInputObjectSchema, create: z.union([ MaintenancePartCreateInputObjectSchema, MaintenancePartUncheckedCreateInputObjectSchema ]), update: z.union([ MaintenancePartUpdateInputObjectSchema, MaintenancePartUncheckedUpdateInputObjectSchema ]) }).strict();