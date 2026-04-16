import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2CreateManyInputObjectSchema as WatchSpecV2CreateManyInputObjectSchema } from './objects/WatchSpecV2CreateManyInput.schema';

export const WatchSpecV2CreateManyAndReturnSchema: z.ZodType<Prisma.WatchSpecV2CreateManyAndReturnArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), data: z.union([ WatchSpecV2CreateManyInputObjectSchema, z.array(WatchSpecV2CreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2CreateManyAndReturnArgs>;

export const WatchSpecV2CreateManyAndReturnZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), data: z.union([ WatchSpecV2CreateManyInputObjectSchema, z.array(WatchSpecV2CreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();