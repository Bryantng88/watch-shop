import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  carrierCode: z.string(),
  carrierEnvironment: z.string(),
  externalOrderCode: z.string()
}).strict();
export const ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInput>;
export const ShipmentCarrierCodeCarrierEnvironmentExternalOrderCodeCompoundUniqueInputObjectZodSchema = makeSchema();
