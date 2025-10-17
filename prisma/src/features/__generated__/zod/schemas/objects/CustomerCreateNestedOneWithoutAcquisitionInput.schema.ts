import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutAcquisitionInputObjectSchema as CustomerCreateWithoutAcquisitionInputObjectSchema } from './CustomerCreateWithoutAcquisitionInput.schema';
import { CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema as CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema } from './CustomerUncheckedCreateWithoutAcquisitionInput.schema';
import { CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema as CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema } from './CustomerCreateOrConnectWithoutAcquisitionInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutAcquisitionInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutAcquisitionInput>;
export const CustomerCreateNestedOneWithoutAcquisitionInputObjectZodSchema = makeSchema();
