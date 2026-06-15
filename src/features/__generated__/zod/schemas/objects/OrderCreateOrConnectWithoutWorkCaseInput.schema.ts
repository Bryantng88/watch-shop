import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutWorkCaseInputObjectSchema as OrderCreateWithoutWorkCaseInputObjectSchema } from './OrderCreateWithoutWorkCaseInput.schema';
import { OrderUncheckedCreateWithoutWorkCaseInputObjectSchema as OrderUncheckedCreateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedCreateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutWorkCaseInput>;
export const OrderCreateOrConnectWithoutWorkCaseInputObjectZodSchema = makeSchema();
