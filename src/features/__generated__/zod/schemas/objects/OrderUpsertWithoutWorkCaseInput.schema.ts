import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutWorkCaseInputObjectSchema as OrderUpdateWithoutWorkCaseInputObjectSchema } from './OrderUpdateWithoutWorkCaseInput.schema';
import { OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema as OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedUpdateWithoutWorkCaseInput.schema';
import { OrderCreateWithoutWorkCaseInputObjectSchema as OrderCreateWithoutWorkCaseInputObjectSchema } from './OrderCreateWithoutWorkCaseInput.schema';
import { OrderUncheckedCreateWithoutWorkCaseInputObjectSchema as OrderUncheckedCreateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedCreateWithoutWorkCaseInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutWorkCaseInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutWorkCaseInput>;
export const OrderUpsertWithoutWorkCaseInputObjectZodSchema = makeSchema();
