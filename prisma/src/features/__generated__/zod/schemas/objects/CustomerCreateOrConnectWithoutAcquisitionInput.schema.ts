import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutAcquisitionInputObjectSchema as CustomerCreateWithoutAcquisitionInputObjectSchema } from './CustomerCreateWithoutAcquisitionInput.schema';
import { CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema as CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedCreateWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutAcquisitionInput>;
export const CustomerCreateOrConnectWithoutAcquisitionInputObjectZodSchema = makeSchema();
