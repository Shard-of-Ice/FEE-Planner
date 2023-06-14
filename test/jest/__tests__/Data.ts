import { promises as fs } from 'fs';
import {
  CharacterDict,
  ClassDict,
  EngravingDict,
  WeaponDataDict,
  csvToDict,
  readAllCharacters,
  readAllClasses,
  readAllEngravings,
  readAllForgingUpgrades,
  readAllWeapons,
  readCsv,
} from 'src/utils/CsvParsing';

class Data {
  classes: ClassDict = {};
  characters: CharacterDict = {};
  weapons: WeaponDataDict = {};
  engravings: EngravingDict = {};
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
      fs.readFile('public/data/engravings.csv'),
    ]);

    const [classes, characters, weapons, forging, engravings] = buffers.map(
      (b) => readCsv(b.toString())
    );

    this.classes = readAllClasses(csvToDict(classes));
    this.characters = readAllCharacters(csvToDict(characters), this.classes);
    const forgingUpgrades = readAllForgingUpgrades(forging);
    this.weapons = readAllWeapons(csvToDict(weapons), forgingUpgrades);
    this.engravings = readAllEngravings(csvToDict(engravings));

    this.loaded = true;
  }
}

const data = new Data();

export default data;
