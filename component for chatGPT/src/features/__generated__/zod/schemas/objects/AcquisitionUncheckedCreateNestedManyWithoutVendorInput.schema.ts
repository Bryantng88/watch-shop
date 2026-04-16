import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutVendorInputObjectSchema as AcquisitionCreateWithoutVendorInputObjectSchema } from './AcquisitionCreateWithoutVendorInput.schema';
import { AcquisitionUncheckedCreateWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateWithoutVendorInput.schema';
import { AcquisitionCreateOrConnectWithoutVendorInputObjectSchema as AcquisitionCreateOrConnectWithoutVendorInputObjectSchema } from './AcquisitionCreateOrConnectWithoutVendorInput.schema';
import { AcquisitionCreateManyVendorInputEnvelopeObjectSchema as AcquisitionCreateManyVendorInputEnvelopeObjectSchema } from './AcquisitionCreateManyVendorInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutVendorInput>;
export const AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();
