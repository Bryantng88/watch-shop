import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './objects/MaintenancePartInclude.schema';
import { MaintenancePartCreateInputObjectSchema as MaintenancePartCreateInputObjectSchema } from './objects/MaintenancePartCreateInput.schema';
import { MaintenancePartUncheckedCreateInputObjectSchema as MaintenancePartUncheckedCreateInputObjectSchema } from './objects/MaintenancePartUncheckedCreateInput.schema';

export const MaintenancePartCreateOneSchema: z.ZodType<Prisma.MaintenancePartCreateArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), data: z.union([MaintenancePartCreateInputObjectSchema, MaintenancePartUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.MaintenancePartCreateArgs>;

export const MaintenancePartCreateOneZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), data: z.union([MaintenancePartCreateInputObjectSchema, MaintenancePartUncheckedCreateInputObjectSchema]) }).strict();