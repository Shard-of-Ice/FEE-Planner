import { promises as fs } from 'fs';
import {
  CharacterDict,
  ClassDict,
  WeaponDataDict,
  csvToDict,
  readAllCharacters,
  readAllClasses,
  readAllForgingUpgrades,
  readAllWeapons,
  readCsv,
} from 'src/utils/CsvParsing';

class Data {
  classes: ClassDict = {};
  characters: CharacterDict = {};
  weapons: WeaponDataDict = {};
  loaded = false;

  async loadFromDisk() {
    if (this.loaded) {
      return;
    }

    const buffers = await Promise.all([
      fs.readFile('public/data/classes.csv'),
      fs.readFile('public/data/characters.csv'),
      fs.readFile('public/data/weapons.csv'),
      fs.readFile('public/data/forging.csv'),
    ]);

    const [classes, characters, weapons, forging] = buffers.map((b) =>
      readCsv(b.toString())
    );

    this.classes = readAllClasses(csvToDict(classes));
    this.characters = readAllCharacters(csvToDict(characters), this.classes);
    const forgingUpgrades = readAllForgingUpgrades(forging);
    this.weapons = readAllWeapons(csvToDict(weapons), forgingUpgrades);

    this.loaded = true;
  }
}

const data = new Data();

export default data;
