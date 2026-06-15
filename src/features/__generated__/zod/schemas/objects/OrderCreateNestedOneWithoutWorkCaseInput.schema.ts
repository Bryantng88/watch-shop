import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutWorkCaseInputObjectSchema as OrderCreateWithoutWorkCaseInputObjectSchema } from './OrderCreateWithoutWorkCaseInput.schema';
import { OrderUncheckedCreateWithoutWorkCaseInputObjectSchema as OrderUncheckedCreateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedCreateWithoutWorkCaseInput.schema';
import { OrderCreateOrConnectWithoutWorkCaseInputObjectSchema as OrderCreateOrConnectWithoutWorkCaseInputObjectSchema } from './OrderCreateOrConnectWithoutWorkCaseInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutWorkCaseInput>;
export const OrderCreateNestedOneWithoutWorkCaseInputObjectZodSchema = makeSchema();
