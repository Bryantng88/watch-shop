import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemWhereUniqueInputObjectSchema as AcquisitionItemWhereUniqueInputObjectSchema } from './AcquisitionItemWhereUniqueInput.schema';
import { AcquisitionItemCreateWithoutVariantInputObjectSchema as AcquisitionItemCreateWithoutVariantInputObjectSchema } from './AcquisitionItemCreateWithoutVariantInput.schema';
import { AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionItemCreateWithoutVariantInputObjectSchema), z.lazy(() => AcquisitionItemUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const AcquisitionItemCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateOrConnectWithoutVariantInput>;
export const AcquisitionItemCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();
