import { Resources } from 'src/game/resources/resources.entity';

export function fromStringToResources(resources?: string | null): Resources | null {
  if (!resources) return null;
  const [white, dark, money, lives] = resources.split(',');

  return {
    white: white ? Number(white) : null,
    dark: dark ? Number(dark) : null,
    money: money ? Number(money) : null,
    lives: lives ? Number(lives) : null
  };
}

export function fromResourcesToString(resources?: Resources | null): string {
  if (!resources) return '';
  const { white, dark, money, lives } = resources;
  return [white, dark, money, lives].join();
}
