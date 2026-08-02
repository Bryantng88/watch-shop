import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementCreateManyStrapVariantInputObjectSchema as StrapInventoryMovementCreateManyStrapVariantInputObjectSchema } from './StrapInventoryMovementCreateManyStrapVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => StrapInventoryMovementCreateManyStrapVariantInputObjectSchema), z.lazy(() => StrapInventoryMovementCreateManyStrapVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCreateManyStrapVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateManyStrapVariantInputEnvelope>;
export const StrapInventoryMovementCreateManyStrapVariantInputEnvelopeObjectZodSchema = makeSchema();
