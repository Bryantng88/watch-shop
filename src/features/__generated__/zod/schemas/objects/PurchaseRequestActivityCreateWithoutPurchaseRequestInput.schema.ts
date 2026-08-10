import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema';
import { UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema as UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema } from './UserCreateNestedOneWithoutPurchaseRequestActivitiesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: PurchaseRequestActivityTypeSchema,
  note: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  actor: z.lazy(() => UserCreateNestedOneWithoutPurchaseRequestActivitiesInputObjectSchema).optional()
}).strict();
export const PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
