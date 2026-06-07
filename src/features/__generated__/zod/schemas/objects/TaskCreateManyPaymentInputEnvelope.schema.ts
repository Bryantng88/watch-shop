import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyPaymentInputObjectSchema as TaskCreateManyPaymentInputObjectSchema } from './TaskCreateManyPaymentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyPaymentInputObjectSchema), z.lazy(() => TaskCreateManyPaymentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyPaymentInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyPaymentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyPaymentInputEnvelope>;
export const TaskCreateManyPaymentInputEnvelopeObjectZodSchema = makeSchema();
