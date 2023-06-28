import { promises as fs } from 'fs';
import {
  CharacterDict,
  ClassDict,
  EmblemDict,
  EngravingDict,
  SkillDict,
  WeaponDataDict,
  readAll,
} from 'src/utils/CsvParsing';

class Data {
  classes: ClassDict = {};
  characters: CharacterDict = {};
  weapons: WeaponDataDict = {};
  engravings: EngravingDict = {};
  emblems: EmblemDict = {};
  skills: SkillDict = {};
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
      fs.readFile('public/data/bonds.csv'),
      fs.readFile('public/data/skills.csv'),
    ]);

    const [classes, characters, weapons, forging, engravings, bonds, skills] =
      buffers.map((b) => b.toString());

    [
      this.classes,
      this.characters,
      this.weapons,
      this.engravings,
      this.emblems,
      this.skills,
    ] = readAll(
      classes,
      characters,
      weapons,
      forging,
      engravings,
      bonds,
      skills
    );

    this.loaded = true;
  }
}

const data = new Data();

export default data;
