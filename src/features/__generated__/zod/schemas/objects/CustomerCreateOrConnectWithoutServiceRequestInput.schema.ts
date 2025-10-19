import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutServiceRequestInputObjectSchema as CustomerCreateWithoutServiceRequestInputObjectSchema } from './CustomerCreateWithoutServiceRequestInput.schema';
import { CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema as CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutServiceRequestInput>;
export const CustomerCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
