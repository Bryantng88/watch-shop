import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutUserInputObjectSchema as CustomerUpdateWithoutUserInputObjectSchema } from './CustomerUpdateWithoutUserInput.schema';
import { CustomerUncheckedUpdateWithoutUserInputObjectSchema as CustomerUncheckedUpdateWithoutUserInputObjectSchema } from './CustomerUncheckedUpdateWithoutUserInput.schema';
import { CustomerCreateWithoutUserInputObjectSchema as CustomerCreateWithoutUserInputObjectSchema } from './CustomerCreateWithoutUserInput.schema';
import { CustomerUncheckedCreateWithoutUserInputObjectSchema as CustomerUncheckedCreateWithoutUserInputObjectSchema } from './CustomerUncheckedCreateWithoutUserInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutUserInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutUserInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutUserInput>;
export const CustomerUpsertWithoutUserInputObjectZodSchema = makeSchema();
