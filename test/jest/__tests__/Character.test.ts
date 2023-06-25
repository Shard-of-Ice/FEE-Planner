import { describe, expect, it } from '@jest/globals';
import { beforeAll } from '@jest/globals';
import data from './Data';

beforeAll(() => {
  return data.loadFromDisk();
});

describe('Character', () => {
  it('should load characters', () => {
    expect(Object.keys(data.characters).length).toBeGreaterThan(0);
  });

  it('should have the right starting class', () => {
    const alear = 'PID_リュール';
    const dragon_child_alear = 'JID_神竜ノ子';

    expect(data.characters[alear].startingClass.id).toEqual(dragon_child_alear);
  });

  it('should not confuse the fell child classes', () => {
    const veyle = 'PID_ヴェイル';
    const nel = 'PID_エル';
    const rafal = 'PID_ラファール';

    const fell_child_veyle = 'JID_邪竜ノ娘';
    const fell_child_nel = 'JID_裏邪竜ノ娘';
    const fell_child_rafal = 'JID_裏邪竜ノ子';

    expect(data.characters[veyle].startingClass.id).toEqual(fell_child_veyle);
    expect(data.characters[nel].startingClass.id).toEqual(fell_child_nel);
    expect(data.characters[rafal].startingClass.id).toEqual(fell_child_rafal);
  });
});
