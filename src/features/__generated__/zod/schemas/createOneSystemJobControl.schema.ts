import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SystemJobControlSelectObjectSchema as SystemJobControlSelectObjectSchema } from './objects/SystemJobControlSelect.schema';
import { SystemJobControlCreateInputObjectSchema as SystemJobControlCreateInputObjectSchema } from './objects/SystemJobControlCreateInput.schema';
import { SystemJobControlUncheckedCreateInputObjectSchema as SystemJobControlUncheckedCreateInputObjectSchema } from './objects/SystemJobControlUncheckedCreateInput.schema';

export const SystemJobControlCreateOneSchema: z.ZodType<Prisma.SystemJobControlCreateArgs> = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  data: z.union([SystemJobControlCreateInputObjectSchema, SystemJobControlUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SystemJobControlCreateArgs>;

export const SystemJobControlCreateOneZodSchema = z.object({ select: SystemJobControlSelectObjectSchema.optional(),  data: z.union([SystemJobControlCreateInputObjectSchema, SystemJobControlUncheckedCreateInputObjectSchema]) }).strict();