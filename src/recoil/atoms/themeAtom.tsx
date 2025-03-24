import { atom } from "recoil";

export type TTheme = "dark" | "light";

export const ThemeAtom = atom<TTheme>({
    key: "ThemeAtomKey",
    default: "dark"   
});