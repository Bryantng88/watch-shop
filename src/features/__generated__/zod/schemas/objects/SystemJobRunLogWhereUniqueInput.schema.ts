import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const SystemJobRunLogWhereUniqueInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogWhereUniqueInput>;
export const SystemJobRunLogWhereUniqueInputObjectZodSchema = makeSchema();
