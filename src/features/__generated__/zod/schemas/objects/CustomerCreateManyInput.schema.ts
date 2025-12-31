import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  ward: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
<<<<<<< HEAD
  address: z.string().optional().nullable()
=======
  address: z.string().optional().nullable(),
  district: z.string().optional().nullable()
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
}).strict();
export const CustomerCreateManyInputObjectSchema: z.ZodType<Prisma.CustomerCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateManyInput>;
export const CustomerCreateManyInputObjectZodSchema = makeSchema();
