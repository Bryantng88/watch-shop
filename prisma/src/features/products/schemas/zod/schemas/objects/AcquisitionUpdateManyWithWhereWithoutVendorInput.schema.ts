import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionScalarWhereInputObjectSchema as AcquisitionScalarWhereInputObjectSchema } from './AcquisitionScalarWhereInput.schema';
import { AcquisitionUpdateManyMutationInputObjectSchema as AcquisitionUpdateManyMutationInputObjectSchema } from './AcquisitionUpdateManyMutationInput.schema';
import { AcquisitionUncheckedUpdateManyWithoutVendorInputObjectSchema as AcquisitionUncheckedUpdateManyWithoutVendorInputObjectSchema } from './AcquisitionUncheckedUpdateManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => AcquisitionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => AcquisitionUpdateManyMutationInputObjectSchema), z.lazy(() => AcquisitionUncheckedUpdateManyWithoutVendorInputObjectSchema)])
}).strict();
export const AcquisitionUpdateManyWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUpdateManyWithWhereWithoutVendorInput>;
export const AcquisitionUpdateManyWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
