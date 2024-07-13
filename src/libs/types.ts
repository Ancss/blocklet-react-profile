// export interface Profile {
//   id: string;
//   username: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   language: string;
//   theme: "light" | "dark";
// }
import { z } from 'zod';
import { profileSchema } from './schema/profile-schema';

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export type Profile = Partial<ProfileSchemaType> & {};
