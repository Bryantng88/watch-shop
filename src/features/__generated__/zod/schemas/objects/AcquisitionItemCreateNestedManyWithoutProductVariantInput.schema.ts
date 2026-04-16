import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateWithoutProductVariantInputObjectSchema as AcquisitionItemCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductVariantInput.schema';
import { AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema as AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateOrConnectWithoutProductVariantInput.schema';
import { AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema as AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema } from './AcquisitionItemCreateManyProductVariantInputEnvelope.schema';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => AcquisitionItemCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema), z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const AcquisitionItemCreateNestedManyWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateNestedManyWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateNestedManyWithoutProductVariantInput>;
export const AcquisitionItemCreateNestedManyWithoutProductVariantInputObjectZodSchema = makeSchema();
