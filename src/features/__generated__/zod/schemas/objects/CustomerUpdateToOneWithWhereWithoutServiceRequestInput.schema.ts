import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutServiceRequestInputObjectSchema as CustomerUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUpdateWithoutServiceRequestInput.schema';
import { CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema as CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './CustomerUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutServiceRequestInput>;
export const CustomerUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
