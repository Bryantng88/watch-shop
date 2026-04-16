import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutOrderInputObjectSchema as CustomerUpdateWithoutOrderInputObjectSchema } from './CustomerUpdateWithoutOrderInput.schema';
import { CustomerUncheckedUpdateWithoutOrderInputObjectSchema as CustomerUncheckedUpdateWithoutOrderInputObjectSchema } from './CustomerUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutOrderInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutOrderInput>;
export const CustomerUpdateToOneWithWhereWithoutOrderInputObjectZodSchema = makeSchema();
