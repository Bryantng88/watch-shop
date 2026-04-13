import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const system_job_run_logWhereUniqueInputObjectSchema: z.ZodType<Prisma.system_job_run_logWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logWhereUniqueInput>;
export const system_job_run_logWhereUniqueInputObjectZodSchema = makeSchema();
