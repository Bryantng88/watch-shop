import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutUserInputObjectSchema as CustomerUpdateWithoutUserInputObjectSchema } from './CustomerUpdateWithoutUserInput.schema';
import { CustomerUncheckedUpdateWithoutUserInputObjectSchema as CustomerUncheckedUpdateWithoutUserInputObjectSchema } from './CustomerUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutUserInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutUserInput>;
export const CustomerUpdateToOneWithWhereWithoutUserInputObjectZodSchema = makeSchema();
