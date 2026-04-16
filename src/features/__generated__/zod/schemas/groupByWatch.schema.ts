import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';
import { WatchOrderByWithAggregationInputObjectSchema as WatchOrderByWithAggregationInputObjectSchema } from './objects/WatchOrderByWithAggregationInput.schema';
import { WatchScalarWhereWithAggregatesInputObjectSchema as WatchScalarWhereWithAggregatesInputObjectSchema } from './objects/WatchScalarWhereWithAggregatesInput.schema';
import { WatchScalarFieldEnumSchema } from './enums/WatchScalarFieldEnum.schema';
import { WatchCountAggregateInputObjectSchema as WatchCountAggregateInputObjectSchema } from './objects/WatchCountAggregateInput.schema';
import { WatchMinAggregateInputObjectSchema as WatchMinAggregateInputObjectSchema } from './objects/WatchMinAggregateInput.schema';
import { WatchMaxAggregateInputObjectSchema as WatchMaxAggregateInputObjectSchema } from './objects/WatchMaxAggregateInput.schema';

export const WatchGroupBySchema: z.ZodType<Prisma.WatchGroupByArgs> = z.object({ where: WatchWhereInputObjectSchema.optional(), orderBy: z.union([WatchOrderByWithAggregationInputObjectSchema, WatchOrderByWithAggregationInputObjectSchema.array()]).optional(), having: WatchScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(WatchScalarFieldEnumSchema), _count: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional(), _min: WatchMinAggregateInputObjectSchema.optional(), _max: WatchMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchGroupByArgs>;

export const WatchGroupByZodSchema = z.object({ where: WatchWhereInputObjectSchema.optional(), orderBy: z.union([WatchOrderByWithAggregationInputObjectSchema, WatchOrderByWithAggregationInputObjectSchema.array()]).optional(), having: WatchScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(WatchScalarFieldEnumSchema), _count: z.union([ z.literal(true), WatchCountAggregateInputObjectSchema ]).optional(), _min: WatchMinAggregateInputObjectSchema.optional(), _max: WatchMaxAggregateInputObjectSchema.optional() }).strict();