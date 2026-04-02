import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsSelectObjectSchema as maintenanceLogsSelectObjectSchema } from './objects/maintenanceLogsSelect.schema';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './objects/maintenanceLogsInclude.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './objects/maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsCreateInputObjectSchema as maintenanceLogsCreateInputObjectSchema } from './objects/maintenanceLogsCreateInput.schema';
import { maintenanceLogsUncheckedCreateInputObjectSchema as maintenanceLogsUncheckedCreateInputObjectSchema } from './objects/maintenanceLogsUncheckedCreateInput.schema';
import { maintenanceLogsUpdateInputObjectSchema as maintenanceLogsUpdateInputObjectSchema } from './objects/maintenanceLogsUpdateInput.schema';
import { maintenanceLogsUncheckedUpdateInputObjectSchema as maintenanceLogsUncheckedUpdateInputObjectSchema } from './objects/maintenanceLogsUncheckedUpdateInput.schema';

export const maintenanceLogsUpsertOneSchema: z.ZodType<Prisma.maintenanceLogsUpsertArgs> = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), where: maintenanceLogsWhereUniqueInputObjectSchema, create: z.union([ maintenanceLogsCreateInputObjectSchema, maintenanceLogsUncheckedCreateInputObjectSchema ]), update: z.union([ maintenanceLogsUpdateInputObjectSchema, maintenanceLogsUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsUpsertArgs>;

export const maintenanceLogsUpsertOneZodSchema = z.object({ select: maintenanceLogsSelectObjectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), where: maintenanceLogsWhereUniqueInputObjectSchema, create: z.union([ maintenanceLogsCreateInputObjectSchema, maintenanceLogsUncheckedCreateInputObjectSchema ]), update: z.union([ maintenanceLogsUpdateInputObjectSchema, maintenanceLogsUncheckedUpdateInputObjectSchema ]) }).strict();