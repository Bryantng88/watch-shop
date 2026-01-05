import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentCreateInputObjectSchema as ShipmentCreateInputObjectSchema } from './objects/ShipmentCreateInput.schema';
import { ShipmentUncheckedCreateInputObjectSchema as ShipmentUncheckedCreateInputObjectSchema } from './objects/ShipmentUncheckedCreateInput.schema';

export const ShipmentCreateOneSchema: z.ZodType<Prisma.ShipmentCreateArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), data: z.union([ShipmentCreateInputObjectSchema, ShipmentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ShipmentCreateArgs>;

export const ShipmentCreateOneZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), data: z.union([ShipmentCreateInputObjectSchema, ShipmentUncheckedCreateInputObjectSchema]) }).strict();