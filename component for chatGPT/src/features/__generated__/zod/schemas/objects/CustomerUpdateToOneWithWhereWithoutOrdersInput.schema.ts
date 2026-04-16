import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutOrdersInputObjectSchema as CustomerUpdateWithoutOrdersInputObjectSchema } from './CustomerUpdateWithoutOrdersInput.schema';
import { CustomerUncheckedUpdateWithoutOrdersInputObjectSchema as CustomerUncheckedUpdateWithoutOrdersInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrdersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutOrdersInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrdersInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutOrdersInput>;
export const CustomerUpdateToOneWithWhereWithoutOrdersInputObjectZodSchema = makeSchema();
