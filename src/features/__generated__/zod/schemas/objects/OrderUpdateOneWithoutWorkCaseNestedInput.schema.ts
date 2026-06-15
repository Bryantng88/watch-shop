import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutWorkCaseInputObjectSchema as OrderCreateWithoutWorkCaseInputObjectSchema } from './OrderCreateWithoutWorkCaseInput.schema';
import { OrderUncheckedCreateWithoutWorkCaseInputObjectSchema as OrderUncheckedCreateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedCreateWithoutWorkCaseInput.schema';
import { OrderCreateOrConnectWithoutWorkCaseInputObjectSchema as OrderCreateOrConnectWithoutWorkCaseInputObjectSchema } from './OrderCreateOrConnectWithoutWorkCaseInput.schema';
import { OrderUpsertWithoutWorkCaseInputObjectSchema as OrderUpsertWithoutWorkCaseInputObjectSchema } from './OrderUpsertWithoutWorkCaseInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema as OrderUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutWorkCaseInput.schema';
import { OrderUpdateWithoutWorkCaseInputObjectSchema as OrderUpdateWithoutWorkCaseInputObjectSchema } from './OrderUpdateWithoutWorkCaseInput.schema';
import { OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema as OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutWorkCaseInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutWorkCaseInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutWorkCaseInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneWithoutWorkCaseNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneWithoutWorkCaseNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneWithoutWorkCaseNestedInput>;
export const OrderUpdateOneWithoutWorkCaseNestedInputObjectZodSchema = makeSchema();
