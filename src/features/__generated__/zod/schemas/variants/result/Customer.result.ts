import * as z from 'zod';

// prettier-ignore
export const CustomerResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    address: z.string().nullable(),
<<<<<<< HEAD
=======
    district: z.string().nullable(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
    Acquisition: z.array(z.unknown()),
    user: z.unknown().nullable(),
    Invoice: z.array(z.unknown()),
    orders: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type CustomerResultType = z.infer<typeof CustomerResultSchema>;
