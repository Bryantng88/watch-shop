import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutSourceOrderInputObjectSchema as AcquisitionUpdateWithoutSourceOrderInputObjectSchema } from './AcquisitionUpdateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutSourceOrderInput.schema';
import { AcquisitionCreateWithoutSourceOrderInputObjectSchema as AcquisitionCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionCreateWithoutSourceOrderInput.schema';
import { AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema as AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema } from './AcquisitionUncheckedCreateWithoutSourceOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutSourceOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutSourceOrderInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutSourceOrderInputObjectSchema)])
}).strict();
export const AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInput>;
export const AcquisitionUpsertWithWhereUniqueWithoutSourceOrderInputObjectZodSchema = makeSchema();
