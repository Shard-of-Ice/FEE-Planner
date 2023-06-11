import { promises as fs } from 'fs';
import {
  CharacterDict,
  ClassDict,
  WeaponDict,
  readAllCharacters,
  readAllClasses,
  readAllWeapons,
  readCsv,
} from 'src/utils/CsvParsing';

class Data {
  classes: ClassDict = {};
  characters: CharacterDict = {};
  weapons: WeaponDict = {};
  loaded = false;

  loadFromDisk() {
    if (this.loaded) {
      console.log('Already loaded');
      return Promise.resolve();
    }
    console.log('Not already loaded');
    return Promise.all([
      fs.readFile('public/data/classes.csv'),
      fs.readFile('public/data/characters.csv'),
      fs.readFile('public/data/weapons.csv'),
    ]).then((buffers) => {
      this.classes = readAllClasses(readCsv(buffers[0].toString()));
      this.characters = readAllCharacters(
        readCsv(buffers[1].toString()),
        this.classes
      );
      this.weapons = readAllWeapons(readCsv(buffers[2].toString()));
      this.loaded = true;
    });
  }
}

const data = new Data();

export default data;
