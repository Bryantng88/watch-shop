import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutProductVariantInputObjectSchema as AcquisitionItemCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateWithoutProductVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutProductVariantInput>;
export const AcquisitionItemCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
