import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const ComplicationUpdateManyMutationInputObjectSchema: z.ZodType<Prisma.ComplicationUpdateManyMutationInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationUpdateManyMutationInput>;
export const ComplicationUpdateManyMutationInputObjectZodSchema = makeSchema();
