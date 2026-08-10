import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityScalarWhereInputObjectSchema as PurchaseRequestActivityScalarWhereInputObjectSchema } from './PurchaseRequestActivityScalarWhereInput.schema';
import { PurchaseRequestActivityUpdateManyMutationInputObjectSchema as PurchaseRequestActivityUpdateManyMutationInputObjectSchema } from './PurchaseRequestActivityUpdateManyMutationInput.schema';
import { PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema as PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema } from './PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PurchaseRequestActivityScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PurchaseRequestActivityUpdateManyMutationInputObjectSchema), z.lazy(() => PurchaseRequestActivityUncheckedUpdateManyWithoutPurchaseRequestInputObjectSchema)])
}).strict();
export const PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityUpdateManyWithWhereWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
