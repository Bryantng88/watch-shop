import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateWithoutOrderInputObjectSchema as PurchaseRequestCreateWithoutOrderInputObjectSchema } from './PurchaseRequestCreateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedCreateWithoutOrderInput.schema';
import { PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema as PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema } from './PurchaseRequestCreateOrConnectWithoutOrderInput.schema';
import { PurchaseRequestUpsertWithoutOrderInputObjectSchema as PurchaseRequestUpsertWithoutOrderInputObjectSchema } from './PurchaseRequestUpsertWithoutOrderInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './PurchaseRequestWhereInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestUpdateToOneWithWhereWithoutOrderInputObjectSchema as PurchaseRequestUpdateToOneWithWhereWithoutOrderInputObjectSchema } from './PurchaseRequestUpdateToOneWithWhereWithoutOrderInput.schema';
import { PurchaseRequestUpdateWithoutOrderInputObjectSchema as PurchaseRequestUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUpdateWithoutOrderInput.schema';
import { PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema as PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema } from './PurchaseRequestUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PurchaseRequestCreateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PurchaseRequestCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  upsert: z.lazy(() => PurchaseRequestUpsertWithoutOrderInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PurchaseRequestWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PurchaseRequestWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PurchaseRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PurchaseRequestUpdateToOneWithWhereWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUpdateWithoutOrderInputObjectSchema), z.lazy(() => PurchaseRequestUncheckedUpdateWithoutOrderInputObjectSchema)]).optional()
}).strict();
export const PurchaseRequestUncheckedUpdateOneWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.PurchaseRequestUncheckedUpdateOneWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestUncheckedUpdateOneWithoutOrderNestedInput>;
export const PurchaseRequestUncheckedUpdateOneWithoutOrderNestedInputObjectZodSchema = makeSchema();
