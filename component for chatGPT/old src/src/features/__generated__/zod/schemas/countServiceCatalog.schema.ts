import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './objects/ServiceCatalogOrderByWithRelationInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './objects/ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogCountAggregateInputObjectSchema as ServiceCatalogCountAggregateInputObjectSchema } from './objects/ServiceCatalogCountAggregateInput.schema';

export const ServiceCatalogCountSchema: z.ZodType<Prisma.ServiceCatalogCountArgs> = z.object({ orderBy: z.union([ServiceCatalogOrderByWithRelationInputObjectSchema, ServiceCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceCatalogWhereInputObjectSchema.optional(), cursor: ServiceCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ServiceCatalogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogCountArgs>;

export const ServiceCatalogCountZodSchema = z.object({ orderBy: z.union([ServiceCatalogOrderByWithRelationInputObjectSchema, ServiceCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceCatalogWhereInputObjectSchema.optional(), cursor: ServiceCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ServiceCatalogCountAggregateInputObjectSchema ]).optional() }).strict();