import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutOrderInputObjectSchema as CustomerCreateWithoutOrderInputObjectSchema } from './CustomerCreateWithoutOrderInput.schema';
import { CustomerUncheckedCreateWithoutOrderInputObjectSchema as CustomerUncheckedCreateWithoutOrderInputObjectSchema } from './CustomerUncheckedCreateWithoutOrderInput.schema';
import { CustomerCreateOrConnectWithoutOrderInputObjectSchema as CustomerCreateOrConnectWithoutOrderInputObjectSchema } from './CustomerCreateOrConnectWithoutOrderInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrderInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutOrderInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutOrderInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutOrderInput>;
export const CustomerCreateNestedOneWithoutOrderInputObjectZodSchema = makeSchema();
