import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateWithoutSourceOrderInputObjectSchema as AcquisitionCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedCreateWithoutSourceOrderInput.schema';
import { AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema as AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateOrConnectWithoutSourceOrderInput.schema';
import { AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema as AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema } from './AcquisitionCreateManySourceOrderInputEnvelope.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema).array(), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionCreateManySourceOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionUncheckedCreateNestedManyWithoutSourceOrderInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutSourceOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedCreateNestedManyWithoutSourceOrderInput>;
export const AcquisitionUncheckedCreateNestedManyWithoutSourceOrderInputObjectZodSchema = makeSchema();
