import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './objects/ServiceRequestOrderByWithRelationInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './objects/ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCountAggregateInputObjectSchema as ServiceRequestCountAggregateInputObjectSchema } from './objects/ServiceRequestCountAggregateInput.schema';

export const ServiceRequestCountSchema: z.ZodType<Prisma.ServiceRequestCountArgs> = z.object({ orderBy: z.union([ServiceRequestOrderByWithRelationInputObjectSchema, ServiceRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceRequestWhereInputObjectSchema.optional(), cursor: ServiceRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ServiceRequestCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestCountArgs>;

export const ServiceRequestCountZodSchema = z.object({ orderBy: z.union([ServiceRequestOrderByWithRelationInputObjectSchema, ServiceRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceRequestWhereInputObjectSchema.optional(), cursor: ServiceRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ServiceRequestCountAggregateInputObjectSchema ]).optional() }).strict();