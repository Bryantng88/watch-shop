import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutProductInputObjectSchema as VendorUpdateWithoutProductInputObjectSchema } from './VendorUpdateWithoutProductInput.schema';
import { VendorUncheckedUpdateWithoutProductInputObjectSchema as VendorUncheckedUpdateWithoutProductInputObjectSchema } from './VendorUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutProductInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutProductInput>;
export const VendorUpdateToOneWithWhereWithoutProductInputObjectZodSchema = makeSchema();
