import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema as PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutActivitiesInput.schema';
import { UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateNestedOneWithoutPurchaseRequestActivitiesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: PurchaseRequestActivityTypeSchema,
  note: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutActivitiesInputObjectSchema),
  actor: z.lazy(() => UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityCreateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateInput>;
export const PurchaseRequestActivityCreateInputObjectZodSchema = makeSchema();
