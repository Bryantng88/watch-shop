import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCreateManyOrderInputObjectSchema as ShipmentCreateManyOrderInputObjectSchema } from './ShipmentCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ShipmentCreateManyOrderInputObjectSchema), z.lazy(() => ShipmentCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ShipmentCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.ShipmentCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCreateManyOrderInputEnvelope>;
export const ShipmentCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
