import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestSelectObjectSchema as CarrierRequestSelectObjectSchema } from './objects/CarrierRequestSelect.schema';
import { CarrierRequestUpdateManyMutationInputObjectSchema as CarrierRequestUpdateManyMutationInputObjectSchema } from './objects/CarrierRequestUpdateManyMutationInput.schema';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './objects/CarrierRequestWhereInput.schema';

export const CarrierRequestUpdateManyAndReturnSchema: z.ZodType<Prisma.CarrierRequestUpdateManyAndReturnArgs> = z.object({ select: CarrierRequestSelectObjectSchema.optional(), data: CarrierRequestUpdateManyMutationInputObjectSchema, where: CarrierRequestWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestUpdateManyAndReturnArgs>;

export const CarrierRequestUpdateManyAndReturnZodSchema = z.object({ select: CarrierRequestSelectObjectSchema.optional(), data: CarrierRequestUpdateManyMutationInputObjectSchema, where: CarrierRequestWhereInputObjectSchema.optional() }).strict();