import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutServiceRequestInputObjectSchema as CustomerCreateWithoutServiceRequestInputObjectSchema } from './CustomerCreateWithoutServiceRequestInput.schema';
import { CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema as CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedCreateWithoutServiceRequestInput.schema';
import { CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema as CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema } from './CustomerCreateOrConnectWithoutServiceRequestInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutServiceRequestInput>;
export const CustomerCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
