import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutAcquisitionInputObjectSchema as CustomerUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUpdateWithoutAcquisitionInput.schema';
import { CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema as CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedUpdateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutAcquisitionInput>;
export const CustomerUpdateToOneWithWhereWithoutAcquisitionInputObjectZodSchema = makeSchema();
