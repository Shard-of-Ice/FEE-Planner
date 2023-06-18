import { promises as fs } from 'fs';
import {
  CharacterDict,
  ClassDict,
  EngravingDict,
  WeaponDataDict,
  readAll,
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

    [this.classes, this.characters, this.weapons, this.engravings] = readAll(
      classes,
      characters,
      weapons,
      forging,
      engravings
    );

    this.loaded = true;
  }
}

const data = new Data();

export default data;
