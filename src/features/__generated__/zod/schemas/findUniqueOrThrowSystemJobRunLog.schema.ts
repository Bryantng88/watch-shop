import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobRunLogSelectObjectSchema as SystemJobRunLogSelectObjectSchema } from './objects/SystemJobRunLogSelect.schema';
import { SystemJobRunLogWhereUniqueInputObjectSchema as SystemJobRunLogWhereUniqueInputObjectSchema } from './objects/SystemJobRunLogWhereUniqueInput.schema';

export const SystemJobRunLogFindUniqueOrThrowSchema: z.ZodType<Prisma.SystemJobRunLogFindUniqueOrThrowArgs> = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemJobRunLogFindUniqueOrThrowArgs>;

export const SystemJobRunLogFindUniqueOrThrowZodSchema = z.object({ select: SystemJobRunLogSelectObjectSchema.optional(),  where: SystemJobRunLogWhereUniqueInputObjectSchema }).strict();