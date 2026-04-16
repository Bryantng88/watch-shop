import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateManyBankInputObjectSchema as VendorCreateManyBankInputObjectSchema } from './VendorCreateManyBankInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => VendorCreateManyBankInputObjectSchema), z.lazy(() => VendorCreateManyBankInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const VendorCreateManyBankInputEnvelopeObjectSchema: z.ZodType<Prisma.VendorCreateManyBankInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateManyBankInputEnvelope>;
export const VendorCreateManyBankInputEnvelopeObjectZodSchema = makeSchema();
