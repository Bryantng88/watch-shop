import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartSelectObjectSchema as MaintenancePartSelectObjectSchema } from './objects/MaintenancePartSelect.schema';
import { MaintenancePartIncludeObjectSchema as MaintenancePartIncludeObjectSchema } from './objects/MaintenancePartInclude.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './objects/MaintenancePartWhereUniqueInput.schema';

export const MaintenancePartFindUniqueSchema: z.ZodType<Prisma.MaintenancePartFindUniqueArgs> = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), where: MaintenancePartWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.MaintenancePartFindUniqueArgs>;

export const MaintenancePartFindUniqueZodSchema = z.object({ select: MaintenancePartSelectObjectSchema.optional(), include: MaintenancePartIncludeObjectSchema.optional(), where: MaintenancePartWhereUniqueInputObjectSchema }).strict();