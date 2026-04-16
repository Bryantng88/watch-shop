import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaUpdateManyMutationInputObjectSchema as WatchMediaUpdateManyMutationInputObjectSchema } from './objects/WatchMediaUpdateManyMutationInput.schema';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './objects/WatchMediaWhereInput.schema';

export const WatchMediaUpdateManySchema: z.ZodType<Prisma.WatchMediaUpdateManyArgs> = z.object({ data: WatchMediaUpdateManyMutationInputObjectSchema, where: WatchMediaWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaUpdateManyArgs>;

export const WatchMediaUpdateManyZodSchema = z.object({ data: WatchMediaUpdateManyMutationInputObjectSchema, where: WatchMediaWhereInputObjectSchema.optional() }).strict();