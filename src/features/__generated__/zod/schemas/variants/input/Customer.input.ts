import * as z from 'zod';

// prettier-ignore
export const CustomerInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    ward: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    userId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    address: z.string().optional().nullable(),
<<<<<<< HEAD
=======
    district: z.string().optional().nullable(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
    Acquisition: z.array(z.unknown()),
    user: z.unknown().optional().nullable(),
    Invoice: z.array(z.unknown()),
    orders: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown())
}).strict();

export type CustomerInputType = z.infer<typeof CustomerInputSchema>;
