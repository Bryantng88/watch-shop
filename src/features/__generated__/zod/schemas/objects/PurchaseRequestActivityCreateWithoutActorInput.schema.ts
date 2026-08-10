import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema as PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutActivitiesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: PurchaseRequestActivityTypeSchema,
  note: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema)
}).strict();
export const PurchaseRequestActivityCreateWithoutActorInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateWithoutActorInput>;
export const PurchaseRequestActivityCreateWithoutActorInputObjectZodSchema = makeSchema();
