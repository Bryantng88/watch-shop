import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenancePartOrderByWithRelationInputObjectSchema as MaintenancePartOrderByWithRelationInputObjectSchema } from './objects/MaintenancePartOrderByWithRelationInput.schema';
import { MaintenancePartWhereInputObjectSchema as MaintenancePartWhereInputObjectSchema } from './objects/MaintenancePartWhereInput.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './objects/MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCountAggregateInputObjectSchema as MaintenancePartCountAggregateInputObjectSchema } from './objects/MaintenancePartCountAggregateInput.schema';

export const MaintenancePartCountSchema: z.ZodType<Prisma.MaintenancePartCountArgs> = z.object({ orderBy: z.union([MaintenancePartOrderByWithRelationInputObjectSchema, MaintenancePartOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenancePartWhereInputObjectSchema.optional(), cursor: MaintenancePartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MaintenancePartCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.MaintenancePartCountArgs>;

export const MaintenancePartCountZodSchema = z.object({ orderBy: z.union([MaintenancePartOrderByWithRelationInputObjectSchema, MaintenancePartOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenancePartWhereInputObjectSchema.optional(), cursor: MaintenancePartWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), MaintenancePartCountAggregateInputObjectSchema ]).optional() }).strict();