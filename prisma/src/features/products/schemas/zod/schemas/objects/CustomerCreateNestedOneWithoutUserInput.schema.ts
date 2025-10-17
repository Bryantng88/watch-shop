import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutUserInputObjectSchema as CustomerCreateWithoutUserInputObjectSchema } from './CustomerCreateWithoutUserInput.schema';
import { CustomerUncheckedCreateWithoutUserInputObjectSchema as CustomerUncheckedCreateWithoutUserInputObjectSchema } from './CustomerUncheckedCreateWithoutUserInput.schema';
import { CustomerCreateOrConnectWithoutUserInputObjectSchema as CustomerCreateOrConnectWithoutUserInputObjectSchema } from './CustomerCreateOrConnectWithoutUserInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutUserInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutUserInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutUserInput>;
export const CustomerCreateNestedOneWithoutUserInputObjectZodSchema = makeSchema();
