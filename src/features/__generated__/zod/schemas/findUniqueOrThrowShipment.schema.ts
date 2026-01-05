import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentSelectObjectSchema as ShipmentSelectObjectSchema } from './objects/ShipmentSelect.schema';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';

export const ShipmentFindUniqueOrThrowSchema: z.ZodType<Prisma.ShipmentFindUniqueOrThrowArgs> = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ShipmentFindUniqueOrThrowArgs>;

export const ShipmentFindUniqueOrThrowZodSchema = z.object({ select: ShipmentSelectObjectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), where: ShipmentWhereUniqueInputObjectSchema }).strict();