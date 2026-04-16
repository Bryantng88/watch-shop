import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaCreateManyInputObjectSchema as WatchMediaCreateManyInputObjectSchema } from './objects/WatchMediaCreateManyInput.schema';

export const WatchMediaCreateManyAndReturnSchema: z.ZodType<Prisma.WatchMediaCreateManyAndReturnArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), data: z.union([ WatchMediaCreateManyInputObjectSchema, z.array(WatchMediaCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaCreateManyAndReturnArgs>;

export const WatchMediaCreateManyAndReturnZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), data: z.union([ WatchMediaCreateManyInputObjectSchema, z.array(WatchMediaCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();