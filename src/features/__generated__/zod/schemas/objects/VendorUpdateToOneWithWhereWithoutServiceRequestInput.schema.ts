import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutServiceRequestInputObjectSchema as VendorUpdateWithoutServiceRequestInputObjectSchema } from './VendorUpdateWithoutServiceRequestInput.schema';
import { VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema as VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutServiceRequestInput>;
export const VendorUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
