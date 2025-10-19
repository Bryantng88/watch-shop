import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecUpdateManyMutationInputObjectSchema as WatchSpecUpdateManyMutationInputObjectSchema } from './objects/WatchSpecUpdateManyMutationInput.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './objects/WatchSpecWhereInput.schema';

export const WatchSpecUpdateManySchema: z.ZodType<Prisma.WatchSpecUpdateManyArgs> = z.object({ data: WatchSpecUpdateManyMutationInputObjectSchema, where: WatchSpecWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecUpdateManyArgs>;

export const WatchSpecUpdateManyZodSchema = z.object({ data: WatchSpecUpdateManyMutationInputObjectSchema, where: WatchSpecWhereInputObjectSchema.optional() }).strict();