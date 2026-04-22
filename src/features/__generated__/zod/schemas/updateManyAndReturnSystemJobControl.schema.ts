import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlUpdateManyMutationInputObjectSchema as SystemJobControlUpdateManyMutationInputObjectSchema } from './objects/SystemJobControlUpdateManyMutationInput.schema';
import { SystemJobControlWhereInputObjectSchema as SystemJobControlWhereInputObjectSchema } from './objects/SystemJobControlWhereInput.schema';

export const SystemJobControlUpdateManyAndReturnSchema: z.ZodType<Prisma.SystemJobControlUpdateManyAndReturnArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(), data: SystemJobControlUpdateManyMutationInputObjectSchema, where: SystemJobControlWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemJobControlUpdateManyAndReturnArgs>;

export const SystemJobControlUpdateManyAndReturnZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(), data: SystemJobControlUpdateManyMutationInputObjectSchema, where: SystemJobControlWhereInputObjectSchema.optional() }).strict();