import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2UpdateManyMutationInputObjectSchema as WatchSpecV2UpdateManyMutationInputObjectSchema } from './objects/WatchSpecV2UpdateManyMutationInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './objects/WatchSpecV2WhereInput.schema';

export const WatchSpecV2UpdateManyAndReturnSchema: z.ZodType<Prisma.WatchSpecV2UpdateManyAndReturnArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), data: WatchSpecV2UpdateManyMutationInputObjectSchema, where: WatchSpecV2WhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateManyAndReturnArgs>;

export const WatchSpecV2UpdateManyAndReturnZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), data: WatchSpecV2UpdateManyMutationInputObjectSchema, where: WatchSpecV2WhereInputObjectSchema.optional() }).strict();