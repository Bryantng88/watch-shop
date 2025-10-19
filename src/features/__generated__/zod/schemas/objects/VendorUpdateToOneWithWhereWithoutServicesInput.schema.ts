import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutServicesInputObjectSchema as VendorUpdateWithoutServicesInputObjectSchema } from './VendorUpdateWithoutServicesInput.schema';
import { VendorUncheckedUpdateWithoutServicesInputObjectSchema as VendorUncheckedUpdateWithoutServicesInputObjectSchema } from './VendorUncheckedUpdateWithoutServicesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutServicesInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutServicesInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutServicesInput>;
export const VendorUpdateToOneWithWhereWithoutServicesInputObjectZodSchema = makeSchema();
