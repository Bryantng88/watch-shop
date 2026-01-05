import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';

export const ShipmentFindUniqueSchema: z.ZodType<Prisma.ShipmentFindUniqueArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentFindUniqueArgs>;

export const ShipmentFindUniqueZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict();