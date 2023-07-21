import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ActionStoreState {
  actionId: string;
  setActionId: (actionId: string) => void;
}

export const useActionStore = create<ActionStoreState>()(
  persist(
    (set) => ({
      actionId: "",
      setActionId: (actionId: string) => set({ actionId }),
    }),
    {
      name: "action-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
