import light from './light/light';
import lightMonochrome from './light/light-monochrome';
import lightPastel from './light/light-pastel';
import catppuccinLatte from './light/catppuccin-latte';
import vscodeLight from './light/vscode';
import dark from './dark/dark';
import darkMonochrome from './dark/dark-monochrome';
import darkPastel from './dark/dark-pastel';
import catppuccinFrappe from './dark/catppuccin-frappe';
import catppuccinMacchiato from './dark/catppuccin-macchiato';
import catppuccinMocha from './dark/catppuccin-mocha';
import nord from './dark/nord';
import vscodeDark from './dark/vscode';
import autumn from './dark/autumn';
import autumnNight from './dark/autumn-night';
import carbon from './dark/carbon';
import curzon from './dark/curzon';
import everblush from './dark/everblush';
import focusNova from './dark/focus-nova';
import kanagawaDragon from './dark/kanagawa-dragon';
import onedarker from './dark/onedarker';
import poimandres from './dark/poimandres';
import rosepine from './dark/rosepine';
import sunset from './dark/sunset';
import vesper from './dark/vesper';

const themes = {
  light,
  dark,
  'light-monochrome': lightMonochrome,
  'light-pastel': lightPastel,
  'dark-monochrome': darkMonochrome,
  'dark-pastel': darkPastel,
  'catppuccin-latte': catppuccinLatte,
  'catppuccin-frappe': catppuccinFrappe,
  'catppuccin-macchiato': catppuccinMacchiato,
  'catppuccin-mocha': catppuccinMocha,
  nord,
  'vscode-light': vscodeLight,
  'vscode-dark': vscodeDark,
  'autumn': autumn,
  'autumn-night': autumnNight,
  'carbon': carbon,
  'curzon': curzon,
  'everblush': everblush,
  'focus-nova': focusNova,
  'kanagawa-dragon': kanagawaDragon,
  'onedarker': onedarker,
  'poimandres': poimandres,
  'rosepine': rosepine,
  'sunset': sunset,
  'vesper': vesper
};

// Theme metadata for UI display
export const themeRegistry = {
  'light': {
    id: 'light',
    name: 'Light',
    mode: 'light'
  },
  'light-monochrome': {
    id: 'light-monochrome',
    name: 'Light Monochrome',
    mode: 'light'
  },
  'light-pastel': {
    id: 'light-pastel',
    name: 'Light Pastel',
    mode: 'light'
  },
  'catppuccin-latte': {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    mode: 'light'
  },
  'dark': {
    id: 'dark',
    name: 'Dark',
    mode: 'dark'
  },
  'dark-monochrome': {
    id: 'dark-monochrome',
    name: 'Dark Monochrome',
    mode: 'dark'
  },
  'dark-pastel': {
    id: 'dark-pastel',
    name: 'Dark Pastel',
    mode: 'dark'
  },
  'catppuccin-frappe': {
    id: 'catppuccin-frappe',
    name: 'Catppuccin Frappé',
    mode: 'dark'
  },
  'catppuccin-macchiato': {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    mode: 'dark'
  },
  'catppuccin-mocha': {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    mode: 'dark'
  },
  'nord': {
    id: 'nord',
    name: 'Nord',
    mode: 'dark'
  },
  'vscode-light': {
    id: 'vscode-light',
    name: 'VS Code Light',
    mode: 'light'
  },
  'vscode-dark': {
    id: 'vscode-dark',
    name: 'VS Code Dark',
    mode: 'dark'
  },
  'autumn': {
    id: 'autumn',
    name: 'Autumn',
    mode: 'dark'
  },
  'autumn-night': {
    id: 'autumn-night',
    name: 'Autumn Night',
    mode: 'dark'
  },
  'carbon': {
    id: 'carbon',
    name: 'Carbon',
    mode: 'dark'
  },
  'curzon': {
    id: 'curzon',
    name: 'Curzon',
    mode: 'dark'
  },
  'everblush': {
    id: 'everblush',
    name: 'Everblush',
    mode: 'dark'
  },
  'focus-nova': {
    id: 'focus-nova',
    name: 'Focus Nova',
    mode: 'dark'
  },
  'kanagawa-dragon': {
    id: 'kanagawa-dragon',
    name: 'Kanagawa Dragon',
    mode: 'dark'
  },
  'onedarker': {
    id: 'onedarker',
    name: 'Onedarker',
    mode: 'dark'
  },
  'poimandres': {
    id: 'poimandres',
    name: 'Poimandres',
    mode: 'dark'
  },
  'rosepine': {
    id: 'rosepine',
    name: 'Rosepine',
    mode: 'dark'
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset',
    mode: 'dark'
  },
  'vesper': {
    id: 'vesper',
    name: 'Vesper',
    mode: 'dark'
  }
};

export const getLightThemes = () => Object.values(themeRegistry).filter((t) => t.mode === 'light');
export const getDarkThemes = () => Object.values(themeRegistry).filter((t) => t.mode === 'dark');

export default themes;
