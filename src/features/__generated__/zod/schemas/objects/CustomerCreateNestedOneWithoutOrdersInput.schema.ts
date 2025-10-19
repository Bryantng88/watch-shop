import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutOrdersInputObjectSchema as CustomerCreateWithoutOrdersInputObjectSchema } from './CustomerCreateWithoutOrdersInput.schema';
import { CustomerUncheckedCreateWithoutOrdersInputObjectSchema as CustomerUncheckedCreateWithoutOrdersInputObjectSchema } from './CustomerUncheckedCreateWithoutOrdersInput.schema';
import { CustomerCreateOrConnectWithoutOrdersInputObjectSchema as CustomerCreateOrConnectWithoutOrdersInputObjectSchema } from './CustomerCreateOrConnectWithoutOrdersInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrdersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutOrdersInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutOrdersInput>;
export const CustomerCreateNestedOneWithoutOrdersInputObjectZodSchema = makeSchema();
