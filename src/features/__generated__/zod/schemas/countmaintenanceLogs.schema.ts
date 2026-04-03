import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsOrderByWithRelationInputObjectSchema as maintenanceLogsOrderByWithRelationInputObjectSchema } from './objects/maintenanceLogsOrderByWithRelationInput.schema';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './objects/maintenanceLogsWhereInput.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './objects/maintenanceLogsWhereUniqueInput.schema';
import { MaintenanceLogsCountAggregateInputObjectSchema as MaintenanceLogsCountAggregateInputObjectSchema } from './objects/MaintenanceLogsCountAggregateInput.schema';

export const maintenanceLogsCountSchema: z.ZodType<Prisma.maintenanceLogsCountArgs> = z.object({ orderBy: z.union([maintenanceLogsOrderByWithRelationInputObjectSchema, maintenanceLogsOrderByWithRelationInputObjectSchema.array()]).optional(), where: maintenanceLogsWhereInputObjectSchema.optional(), cursor: maintenanceLogsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MaintenanceLogsCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsCountArgs>;

export const maintenanceLogsCountZodSchema = z.object({ orderBy: z.union([maintenanceLogsOrderByWithRelationInputObjectSchema, maintenanceLogsOrderByWithRelationInputObjectSchema.array()]).optional(), where: maintenanceLogsWhereInputObjectSchema.optional(), cursor: maintenanceLogsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MaintenanceLogsCountAggregateInputObjectSchema ]).optional() }).strict();