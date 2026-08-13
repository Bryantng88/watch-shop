import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInputObjectSchema as ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInputObjectSchema } from './ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  carrierCode_carrierEnvironment_externalOrderCode: z.lazy(() => ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const ShipmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.ShipmentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentWhereUniqueInput>;
export const ShipmentWhereUniqueInputObjectZodSchema = makeSchema();
