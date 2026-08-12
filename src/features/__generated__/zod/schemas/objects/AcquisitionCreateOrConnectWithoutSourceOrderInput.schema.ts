import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutSourceOrderInputObjectSchema as AcquisitionCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedCreateWithoutSourceOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutSourceOrderInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutSourceOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutSourceOrderInput>;
export const AcquisitionCreateOrConnectWithoutSourceOrderInputObjectZodSchema = makeSchema();
