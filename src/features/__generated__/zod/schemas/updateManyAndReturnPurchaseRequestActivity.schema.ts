import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestActivitySelectObjectSchema as PurchaseRequestActivitySelectObjectSchema } from './objects/PurchaseRequestActivitySelect.schema';
import { PurchaseRequestActivityUpdateManyMutationInputObjectSchema as PurchaseRequestActivityUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestActivityUpdateManyMutationInput.schema';
import { PurchaseRequestActivityWhereInputObjectSchema as PurchaseRequestActivityWhereInputObjectSchema } from './objects/PurchaseRequestActivityWhereInput.schema';

export const PurchaseRequestActivityUpdateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestActivityUpdateManyAndReturnArgs> = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), data: PurchaseRequestActivityUpdateManyMutationInputObjectSchema, where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUpdateManyAndReturnArgs>;

export const PurchaseRequestActivityUpdateManyAndReturnZodSchema = z.object({ select: PurchaseRequestActivitySelectObjectSchema.optional(), data: PurchaseRequestActivityUpdateManyMutationInputObjectSchema, where: PurchaseRequestActivityWhereInputObjectSchema.optional() }).strict();