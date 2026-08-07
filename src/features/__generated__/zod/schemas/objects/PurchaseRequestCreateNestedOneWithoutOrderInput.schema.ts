import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutOrderInputObjectSchema as PurchaseRequestCreateWithoutOrderInputObjectSchema } from './PurchaseRequestCreateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutOrderInput.schema';
import { PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema as PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutOrderInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestCreateNestedOneWithoutOrderInputObjectSchema: z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCreateNestedOneWithoutOrderInput>;
export const PurchaseRequestCreateNestedOneWithoutOrderInputObjectZodSchema = makeSchema();
