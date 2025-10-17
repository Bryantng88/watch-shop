import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const MarketSegmentUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.MarketSegmentUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUpdateManyMutationInput>;
export const MarketSegmentUpdateManyMutationInputObjectZodSchema = makeSchema();
