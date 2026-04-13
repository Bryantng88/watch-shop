import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.string().optional()
}).strict();
export const system_job_controlWhereUniqueInputObjectSchema: z.ZodType<Prisma.system_job_controlWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlWhereUniqueInput>;
export const system_job_controlWhereUniqueInputObjectZodSchema = makeSchema();
