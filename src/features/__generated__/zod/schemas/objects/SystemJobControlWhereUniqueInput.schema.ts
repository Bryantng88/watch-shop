import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.string().optional()
}).strict();
export const SystemJobControlWhereUniqueInputObjectSchema: z.ZodType<Prisma.SystemJobControlWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlWhereUniqueInput>;
export const SystemJobControlWhereUniqueInputObjectZodSchema = makeSchema();
