import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeSelectObjectSchema as CarrierChargeSelectObjectSchema } from './objects/CarrierChargeSelect.schema';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';

export const CarrierChargeFindUniqueOrThrowSchema: z.ZodType<Prisma.CarrierChargeFindUniqueOrThrowArgs> = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierChargeFindUniqueOrThrowArgs>;

export const CarrierChargeFindUniqueOrThrowZodSchema = z.object({ select: CarrierChargeSelectObjectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), where: CarrierChargeWhereUniqueInputObjectSchema }).strict();