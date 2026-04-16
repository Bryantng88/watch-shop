import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './AcquisitionWhereUniqueInput.schema';
import { AcquisitionCreateWithoutVendorInputObjectSchema as AcquisitionCreateWithoutVendorInputObjectSchema } from './AcquisitionCreateWithoutVendorInput.schema';
import { AcquisitionUncheckedCreateWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => AcquisitionCreateWithoutVendorInputObjectSchema), z.lazy(() => AcquisitionUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const AcquisitionCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateOrConnectWithoutVendorInput>;
export const AcquisitionCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
