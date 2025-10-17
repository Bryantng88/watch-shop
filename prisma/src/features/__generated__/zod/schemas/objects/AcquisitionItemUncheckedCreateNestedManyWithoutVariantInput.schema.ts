import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutVariantInputObjectSchema as AcquisitionItemCreateWithoutVariantInputObjectSchema } from './AcquisitionItemCreateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutVariantInput.schema';
import { AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema as AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutVariantInput.schema';
import { AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema as AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyVariantInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemUncheckedCreateNestedManyWithoutVariantInput>;
export const AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectZodSchema = makeSchema();
