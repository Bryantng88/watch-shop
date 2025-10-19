import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutVendorInputObjectSchema as AcquisitionUpdateWithoutVendorInputObjectSchema } from './AcquisitionUpdateWithoutVendorInput.schema';
import { AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema as AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateWithWhereUniqueWithoutVendorInput>;
export const AcquisitionUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
