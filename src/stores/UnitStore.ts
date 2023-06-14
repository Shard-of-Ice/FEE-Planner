import { useStaticStore } from './StaticStore';
import { defineStore } from 'pinia';
import { Unit } from '../models/Unit';
import { Base64 } from 'src/utils/Base64';

interface UnitStoreState {
  unitList: Unit[];
}

function unitToBase64(unit: Unit): string {
  const staticStore = useStaticStore();
  const characterNumber = staticStore.playableCharacters.indexOf(
    unit.character.id
  );
  const classNumber = staticStore
    .getAllowedClasses(unit.character)
    .indexOf(unit.class);
  const level = unit.level;
  return Base64.fromTinyIntArray([characterNumber, classNumber, level]);
}

function unitFromBAse64(str: string): Unit {
  const staticStore = useStaticStore();
  const [characterNumber, classNumber, level] = Base64.toTinyIntArray(str);
  const character =
    staticStore.characters[staticStore.playableCharacters[characterNumber]];
  const clss = staticStore.getAllowedClasses(character)[classNumber];

  console.log({
    characterNumber: characterNumber,
    character: character,
    classNumber: classNumber,
    clss: clss,
    level: level,
  });

  return new Unit(character, level, clss);
}

export const useUnitStore = defineStore('unit', {
  state: (): UnitStoreState => ({
    unitList: [],
  }),

  getters: {
    toBase64(): string {
      return Array.from(this.unitList as Unit[], (unit: Unit) =>
        unitToBase64(unit)
      ).join();
    },
  },

  actions: {
    loadDefaultTeam() {
      const staticStore = useStaticStore();

      for (const key of staticStore.playableCharacters) {
        const character = staticStore.characters[key];
        this.unitList.push(new Unit(character));
      }
    },

    loadTeamFromBase64(base64: string) {
      this.unitList = Array.from(base64.match(/.{3}/g) || [], (str) =>
        unitFromBAse64(str)
      );
    },
  },
});
