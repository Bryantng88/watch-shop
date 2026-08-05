import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  publicRequestChannel: z.string(),
  publicExternalId: z.string()
}).strict();
export const OrderPublicRequestChannelPublicExternalIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.OrderPublicRequestChannelPublicExternalIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderPublicRequestChannelPublicExternalIdCompoundUniqueInput>;
export const OrderPublicRequestChannelPublicExternalIdCompoundUniqueInputObjectZodSchema = makeSchema();
