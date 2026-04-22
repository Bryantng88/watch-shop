import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlWhereInputObjectSchema as SystemJobControlWhereInputObjectSchema } from './objects/SystemJobControlWhereInput.schema';

export const SystemJobControlDeleteManySchema: z.ZodType<Prisma.SystemJobControlDeleteManyArgs> = z.object({ where: SystemJobControlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlDeleteManyArgs>;

export const SystemJobControlDeleteManyZodSchema = z.object({ where: SystemJobControlWhereInputObjectSchema.optional() }).strict();