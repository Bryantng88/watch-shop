import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutServiceRequestInputObjectSchema as VendorCreateWithoutServiceRequestInputObjectSchema } from './VendorCreateWithoutServiceRequestInput.schema';
import { VendorUncheckedCreateWithoutServiceRequestInputObjectSchema as VendorUncheckedCreateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutServiceRequestInput>;
export const VendorCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
