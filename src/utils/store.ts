import { create } from "zustand"

type Role = 'admin' | 'staff' | 'user';

interface ProfileState {
  isRole : Role;
  setRole: (role: Role) => void;
  userId: string;
  setUserId: (userId: string) => void;
}

const useStore = create<ProfileState>((set) => ({
  isRole: "user",
  setRole: (role: Role) => set({ isRole: role as Role }),
  userId: '',
  setUserId: (userId: string) => set({ userId}),
}));

export default useStore;