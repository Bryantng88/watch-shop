import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutCustomerInputObjectSchema as AcquisitionCreateWithoutCustomerInputObjectSchema } from './AcquisitionCreateWithoutCustomerInput.schema';
import { AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateWithoutCustomerInput.schema';
import { AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema as AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema } from './AcquisitionCreateOrConnectWithoutCustomerInput.schema';
import { AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectSchema as AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectSchema } from './AcquisitionUpsertWithWhereUniqueWithoutCustomerInput.schema';
import { AcquisitionCreateManyCustomerInputEnvelopeObjectSchema as AcquisitionCreateManyCustomerInputEnvelopeObjectSchema } from './AcquisitionCreateManyCustomerInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectSchema as AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectSchema } from './AcquisitionUpdateWithWhereUniqueWithoutCustomerInput.schema';
import { AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectSchema as AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectSchema } from './AcquisitionUpdateManyWithWhereWithoutCustomerInput.schema';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectSchema), z.lazy(() => AcquisitionUpdateManyWithWhereWithoutCustomerInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionScalarWhereInputObjectSchema), z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedUpdateManyWithoutCustomerNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedUpdateManyWithoutCustomerNestedInput>;
export const AcquisitionUncheckedUpdateManyWithoutCustomerNestedInputObjectZodSchema = makeSchema();
