import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutOrdersInputObjectSchema as CustomerCreateWithoutOrdersInputObjectSchema } from './CustomerCreateWithoutOrdersInput.schema';
import { CustomerUncheckedCreateWithoutOrdersInputObjectSchema as CustomerUncheckedCreateWithoutOrdersInputObjectSchema } from './CustomerUncheckedCreateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrdersInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutOrdersInput>;
export const CustomerCreateOrConnectWithoutOrdersInputObjectZodSchema = makeSchema();
