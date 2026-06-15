import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCreateManyShipmentInputObjectSchema as WorkCaseCreateManyShipmentInputObjectSchema } from './WorkCaseCreateManyShipmentInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkCaseCreateManyShipmentInputObjectSchema), z.lazy(() => WorkCaseCreateManyShipmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkCaseCreateManyShipmentInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkCaseCreateManyShipmentInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCreateManyShipmentInputEnvelope>;
export const WorkCaseCreateManyShipmentInputEnvelopeObjectZodSchema = makeSchema();
