import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionUpdateWithoutVendorInputObjectSchema as AcquisitionUpdateWithoutVendorInputObjectSchema } from './AcquisitionUpdateWithoutVendorInput.schema';
import { AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema as AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedUpdateWithoutVendorInput.schema';
import { AcquisitionCreateWithoutVendorInputObjectSchema as AcquisitionCreateWithoutVendorInputObjectSchema } from './AcquisitionCreateWithoutVendorInput.schema';
import { AcquisitionUncheckedCreateWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => AcquisitionUpdateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpsertWithWhereUniqueWithoutVendorInput>;
export const AcquisitionUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
