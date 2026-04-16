import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutVendorInputObjectSchema as AcquisitionCreateWithoutVendorInputObjectSchema } from './AcquisitionCreateWithoutVendorInput.schema';
import { AcquisitionUncheckedCreateWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateWithoutVendorInput.schema';
import { AcquisitionCreateOrConnectWithoutVendorInputObjectSchema as AcquisitionCreateOrConnectWithoutVendorInputObjectSchema } from './AcquisitionCreateOrConnectWithoutVendorInput.schema';
import { AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectSchema as AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './AcquisitionUpsertWithWhereUniqueWithoutVendorInput.schema';
import { AcquisitionCreateManyVendorInputEnvelopeObjectSchema as AcquisitionCreateManyVendorInputEnvelopeObjectSchema } from './AcquisitionCreateManyVendorInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectSchema as AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './AcquisitionUpdateWithWhereUniqueWithoutVendorInput.schema';
import { AcquisitionUpdateManyWithWhereWithoutVendorInputObjectSchema as AcquisitionUpdateManyWithWhereWithoutVendorInputObjectSchema } from './AcquisitionUpdateManyWithWhereWithoutVendorInput.schema';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => AcquisitionUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => AcquisitionScalarWhereInputObjectSchema), z.lazy(() => AcquisitionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedUpdateManyWithoutVendorNestedInput>;
export const AcquisitionUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
