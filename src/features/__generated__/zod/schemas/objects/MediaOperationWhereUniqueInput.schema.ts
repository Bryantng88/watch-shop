import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  idempotencyKey: z.string().optional()
}).strict();
export const MediaOperationWhereUniqueInputObjectSchema: z.ZodType<Prisma.MediaOperationWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationWhereUniqueInput>;
export const MediaOperationWhereUniqueInputObjectZodSchema = makeSchema();
