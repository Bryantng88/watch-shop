import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const approvalRequestsWhereUniqueInputObjectSchema: z.ZodType<Prisma.approvalRequestsWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsWhereUniqueInput>;
export const approvalRequestsWhereUniqueInputObjectZodSchema = makeSchema();
