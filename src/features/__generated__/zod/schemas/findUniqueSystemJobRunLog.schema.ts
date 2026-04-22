import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';

export const SystemJobRunLogFindUniqueSchema: z.ZodType<Prisma.SystemJobRunLogFindUniqueArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogFindUniqueArgs>;

export const SystemJobRunLogFindUniqueZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict();