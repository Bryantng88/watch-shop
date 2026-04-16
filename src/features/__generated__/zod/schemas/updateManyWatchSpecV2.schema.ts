import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2UpdateManyMutationInputObjectSchema as WatchSpecV2UpdateManyMutationInputObjectSchema } from './objects/WatchSpecV2UpdateManyMutationInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './objects/WatchSpecV2WhereInput.schema';

export const WatchSpecV2UpdateManySchema: z.ZodType<Prisma.WatchSpecV2UpdateManyArgs> = z.object({ data: WatchSpecV2UpdateManyMutationInputObjectSchema, where: WatchSpecV2WhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2UpdateManyArgs>;

export const WatchSpecV2UpdateManyZodSchema = z.object({ data: WatchSpecV2UpdateManyMutationInputObjectSchema, where: WatchSpecV2WhereInputObjectSchema.optional() }).strict();