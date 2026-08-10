import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateManyAssignedUserInputObjectSchema as PurchaseRequestCreateManyAssignedUserInputObjectSchema } from './PurchaseRequestCreateManyAssignedUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => PurchaseRequestCreateManyAssignedUserInputObjectSchema), z.lazy(() => PurchaseRequestCreateManyAssignedUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateManyAssignedUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateManyAssignedUserInputEnvelope>;
export const PurchaseRequestCreateManyAssignedUserInputEnvelopeObjectZodSchema = makeSchema();
