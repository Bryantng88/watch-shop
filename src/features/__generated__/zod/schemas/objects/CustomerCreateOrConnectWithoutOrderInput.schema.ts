import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutOrderInputObjectSchema as CustomerCreateWithoutOrderInputObjectSchema } from './CustomerCreateWithoutOrderInput.schema';
import { CustomerUncheckedCreateWithoutOrderInputObjectSchema as CustomerUncheckedCreateWithoutOrderInputObjectSchema } from './CustomerUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutOrderInput>;
export const CustomerCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
