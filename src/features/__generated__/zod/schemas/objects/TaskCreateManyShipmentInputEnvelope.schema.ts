import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateManyShipmentInputObjectSchema as TaskCreateManyShipmentInputObjectSchema } from './TaskCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskCreateManyShipmentInputObjectSchema), z.lazy(() => TaskCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateManyShipmentInputEnvelope>;
export const TaskCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
