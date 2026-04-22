import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogWhereInputObjectSchema as SystemJobRunLogWhereInputObjectSchema } from './objects/SystemJobRunLogWhereInput.schema';

export const SystemJobRunLogDeleteManySchema: z.ZodType<Prisma.SystemJobRunLogDeleteManyArgs> = z.object({ where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogDeleteManyArgs>;

export const SystemJobRunLogDeleteManyZodSchema = z.object({ where: SystemJobRunLogWhereInputObjectSchema.optional() }).strict();