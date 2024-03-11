import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
};

type UserAuth = {
  token: string;
  updateToken: (token: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (user: UserProfile) => void;
  logout: () => void;
};

export const useUserAuthStore = create<UserAuth>()(
  persist(
    (set) => ({
      token: "",
      updateToken: (token) => set({ token }),
      userProfile: {} as UserProfile,
      updateUserProfile: (user) => set({ userProfile: user }),
      logout: () => set({ token: "", userProfile: {} as UserProfile }),
    }),
    {
      name: "user-auth", // name of the item in the storage (must be unique)
    }
  )
);
