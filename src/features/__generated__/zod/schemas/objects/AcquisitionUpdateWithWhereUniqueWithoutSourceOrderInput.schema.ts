import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutSourceOrderInputObjectSchema as AcquisitionUpdateWithoutSourceOrderInputObjectSchema } from './AcquisitionUpdateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutSourceOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema)])
}).strict();
export const AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInput>;
export const AcquisitionUpdateWithWhereUniqueWithoutSourceOrderInputObjectZodSchema = makeSchema();
