import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutServiceRequestInputObjectSchema as VendorCreateWithoutServiceRequestInputObjectSchema } from './VendorCreateWithoutServiceRequestInput.schema';
import { VendorUncheckedCreateWithoutServiceRequestInputObjectSchema as VendorUncheckedCreateWithoutServiceRequestInputObjectSchema } from './VendorUncheckedCreateWithoutServiceRequestInput.schema';
import { VendorCreateOrConnectWithoutServiceRequestInputObjectSchema as VendorCreateOrConnectWithoutServiceRequestInputObjectSchema } from './VendorCreateOrConnectWithoutServiceRequestInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutServiceRequestInput>;
export const VendorCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
