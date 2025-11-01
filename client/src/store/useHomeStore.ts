import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface HomeState {
  active: string;
  setActive: (section: string) => void;
}

export const useHomeStore = create<HomeState>()(
//   persist(
    (set) => ({
      active: "Dashboard", // default section
      setActive: (section) => {
        set({ active: section })
        console.log("Zustnad ruinng");
      },
    }),
    // {
    //   name: "home-store", // localStorage key
    // }
//   )
);
