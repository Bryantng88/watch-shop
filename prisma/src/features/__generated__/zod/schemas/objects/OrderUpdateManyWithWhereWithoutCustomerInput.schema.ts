import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderScalarWhereInputObjectSchema as OrderScalarWhereInputObjectSchema } from './OrderScalarWhereInput.schema';
import { OrderUpdateManyMutationInputObjectSchema as OrderUpdateManyMutationInputObjectSchema } from './OrderUpdateManyMutationInput.schema';
import { OrderUncheckedUpdateManyWithoutCustomerInputObjectSchema as OrderUncheckedUpdateManyWithoutCustomerInputObjectSchema } from './OrderUncheckedUpdateManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderUpdateManyMutationInputObjectSchema), z.lazy(() => OrderUncheckedUpdateManyWithoutCustomerInputObjectSchema)])
}).strict();
export const OrderUpdateManyWithWhereWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutCustomerInput>;
export const OrderUpdateManyWithWhereWithoutCustomerInputObjectZodSchema = makeSchema();
