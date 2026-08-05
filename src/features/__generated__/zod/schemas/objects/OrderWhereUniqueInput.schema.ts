import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderPublicRequestChannelPublicExternalIdCompoundUniqueInputObjectSchema as OrderPublicRequestChannelPublicExternalIdCompoundUniqueInputObjectSchema } from './OrderPublicRequestChannelPublicExternalIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional(),
  publicRequestKey: z.string().optional(),
  publicRequestChannel_publicExternalId: z.lazy(() => OrderPublicRequestChannelPublicExternalIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const OrderWhereUniqueInputObjectSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderWhereUniqueInput>;
export const OrderWhereUniqueInputObjectZodSchema = makeSchema();
