import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutAcquisitionInputObjectSchema as CustomerUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUpdateWithoutAcquisitionInput.schema';
import { CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema as CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedUpdateWithoutAcquisitionInput.schema';
import { CustomerCreateWithoutAcquisitionInputObjectSchema as CustomerCreateWithoutAcquisitionInputObjectSchema } from './CustomerCreateWithoutAcquisitionInput.schema';
import { CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema as CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedCreateWithoutAcquisitionInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutAcquisitionInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutAcquisitionInput>;
export const CustomerUpsertWithoutAcquisitionInputObjectZodSchema = makeSchema();
