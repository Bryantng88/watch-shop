import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ProductPostTargetUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.ProductPostTargetUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetUpdateManyMutationInput>;
export const ProductPostTargetUpdateManyMutationInputObjectZodSchema = makeSchema();
