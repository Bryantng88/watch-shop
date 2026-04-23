import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema as AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema } from './AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelope.schema';
import { AcquisitionSpecJobLogWhereUniqueInputObjectSchema as AcquisitionSpecJobLogWhereUniqueInputObjectSchema } from './AcquisitionSpecJobLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogCreateWithoutAcquisitionSpecJobInputObjectSchema).array(), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogUncheckedCreateWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogCreateOrConnectWithoutAcquisitionSpecJobInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionSpecJobLogCreateManyAcquisitionSpecJobInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionSpecJobLogUncheckedCreateNestedManyWithoutAcquisitionSpecJobInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUncheckedCreateNestedManyWithoutAcquisitionSpecJobInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUncheckedCreateNestedManyWithoutAcquisitionSpecJobInput>;
export const AcquisitionSpecJobLogUncheckedCreateNestedManyWithoutAcquisitionSpecJobInputObjectZodSchema = makeSchema();
