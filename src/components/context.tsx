import { createContext } from "react";

export type Type = {
  characterType: string
  charactersText: string
  weaponType: string
  weaponsText: string
}

export const TypeContext = createContext<Type>({
  characterType: 'characters',
  charactersText: 'Characters',
  weaponType: 'weapons',
  weaponsText: 'Weapons',
});
