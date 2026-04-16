import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutUserInputObjectSchema as CustomerCreateWithoutUserInputObjectSchema } from './CustomerCreateWithoutUserInput.schema';
import { CustomerUncheckedCreateWithoutUserInputObjectSchema as CustomerUncheckedCreateWithoutUserInputObjectSchema } from './CustomerUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutUserInput>;
export const CustomerCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
