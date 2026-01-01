import React from 'react';
import { ColorSection } from './components';

// Helix Editor Themes
const autumn = {
  name: 'Autumn',
  mode: 'dark',
  base: '#232323',
  accents: {
    GREEN: '#99be70',
    RED: '#F05E48',
    YELLOW: '#FAD566',
    TURQUOISE: '#86c1b9',
    BROWN: '#cfba8b'
  },
  surface: {
    TEXT: '#F3F2CC',
    SUBTEXT1: '#c8c8c8',
    SUBTEXT0: '#a8a8a8',
    OVERLAY: '#646f69',
    SURFACE2: '#404040',
    SURFACE1: '#323232',
    SURFACE0: '#2b2b2b',
    BASE: '#232323',
    MANTLE: '#232323',
    CRUST: '#212121'
  }
};

const autumnNight = {
  name: 'Autumn Night',
  mode: 'dark',
  base: '#090909',
  accents: {
    GREEN: '#99be70',
    RED: '#F05E48',
    YELLOW: '#FAD566',
    TURQUOISE: '#86c1b9',
    BROWN: '#cfba8b'
  },
  surface: {
    TEXT: '#F3F2CC',
    SUBTEXT1: '#c4c4c4',
    SUBTEXT0: '#aaaaaa',
    OVERLAY: '#626C66',
    SURFACE2: '#404040',
    SURFACE1: '#1a1a1a',
    SURFACE0: '#0e0e0e',
    BASE: '#090909',
    MANTLE: '#090909',
    CRUST: '#111111'
  }
};

const carbon = {
  name: 'Carbon',
  mode: 'dark',
  base: '#161616',
  accents: {
    BLUE: '#78a9ff',
    GREEN: '#42be65',
    RED: '#ff8389',
    YELLOW: '#f1c21b',
    CYAN: '#08bdba',
    MAGENTA: '#ff7eb6'
  },
  surface: {
    TEXT: '#a8a8a8',
    SUBTEXT1: '#8D8D8D',
    SUBTEXT0: '#6F6F6F',
    OVERLAY: '#6F6F6F',
    SURFACE2: '#525252',
    SURFACE1: '#393939',
    SURFACE0: '#262626',
    BASE: '#161616',
    MANTLE: '#161616',
    CRUST: '#161616'
  }
};

const curzon = {
  name: 'Curzon',
  mode: 'dark',
  base: '#000000',
  accents: {
    BLUE: '#6366f1',
    GREEN: '#10b981',
    RED: '#f43f5e',
    YELLOW: '#ffcd1c',
    LIGHT_BLUE: '#bee0ec',
    TURQUOISE: '#38bdf8'
  },
  surface: {
    TEXT: '#bfdbfe',
    SUBTEXT1: '#93c5fd',
    SUBTEXT0: '#b8b8b8',
    OVERLAY: '#484a4d',
    SURFACE2: '#484a4d',
    SURFACE1: '#1e3a8a',
    SURFACE0: '#111111',
    BASE: '#000000',
    MANTLE: '#000000',
    CRUST: '#111111'
  }
};

const everblush = {
  name: 'Everblush',
  mode: 'dark',
  base: '#141b1e',
  accents: {
    BLUE: '#67b0e8',
    GREEN: '#8ccf7e',
    RED: '#e57474',
    YELLOW: '#e5c76b',
    MAGENTA: '#c47fd5',
    CYAN: '#6cbfbf'
  },
  surface: {
    TEXT: '#dadada',
    SUBTEXT1: '#b3b9b8',
    SUBTEXT0: '#b3b9b8',
    OVERLAY: '#404749',
    SURFACE2: '#2c3333',
    SURFACE1: '#2d3437',
    SURFACE0: '#232a2d',
    BASE: '#141b1e',
    MANTLE: '#141b1e',
    CRUST: '#161d1f'
  }
};

const focusNova = {
  name: 'Focus Nova',
  mode: 'dark',
  base: '#1e1e2e',
  accents: {
    BLUE: '#89b4fa',
    GREEN: '#c0fca0',
    RED: '#ff6e7f',
    YELLOW: '#f9e2af',
    PURPLE: '#cba6f7',
    AQUA: '#94e2d5'
  },
  surface: {
    TEXT: '#dcdcdc',
    SUBTEXT1: '#c0c0c0',
    SUBTEXT0: '#a8a8a8',
    OVERLAY: '#7a7a89',
    SURFACE2: '#4b4b5e',
    SURFACE1: '#3b3b4d',
    SURFACE0: '#2e2e3e',
    BASE: '#1e1e2e',
    MANTLE: '#1c1c2a',
    CRUST: '#1e1e2e'
  }
};

const kanagawaDragon = {
  name: 'Kanagawa Dragon',
  mode: 'dark',
  base: '#0d0c0c',
  accents: {
    BLUE: '#8ba4b0',
    GREEN: '#87a987',
    RED: '#c4746e',
    YELLOW: '#c4b28a',
    VIOLET: '#8992a7',
    AQUA: '#8ea4a2'
  },
  surface: {
    TEXT: '#c5c9c5',
    SUBTEXT1: '#a6a69c',
    SUBTEXT0: '#9e9b93',
    OVERLAY: '#737c73',
    SURFACE2: '#393836',
    SURFACE1: '#282727',
    SURFACE0: '#1D1C19',
    BASE: '#0d0c0c',
    MANTLE: '#12120f',
    CRUST: '#0d0c0c'
  }
};

const onedarker = {
  name: 'Onedarker',
  mode: 'dark',
  base: '#16181A',
  accents: {
    BLUE: '#519FDF',
    GREEN: '#7DA869',
    RED: '#D05C65',
    YELLOW: '#D5B06B',
    PURPLE: '#B668CD',
    CYAN: '#46A6B2'
  },
  surface: {
    TEXT: '#ABB2BF',
    SUBTEXT1: '#ABB2BF',
    SUBTEXT0: '#636C6E',
    OVERLAY: '#636C6E',
    SURFACE2: '#282C34',
    SURFACE1: '#252D30',
    SURFACE0: '#1e2124',
    BASE: '#16181A',
    MANTLE: '#16181A',
    CRUST: '#12100E'
  }
};

const poimandres = {
  name: 'Poimandres',
  mode: 'dark',
  base: '#1b1e28',
  accents: {
    BLUE: '#ADD7FF',
    GREEN: '#5fb3a1',
    RED: '#d0679d',
    YELLOW: '#fffac2',
    MINT: '#5DE4c7',
    LIGHT_BLUE: '#89ddff'
  },
  surface: {
    TEXT: '#e4f0fb',
    SUBTEXT1: '#a6accd',
    SUBTEXT0: '#767c9d',
    OVERLAY: '#6c7494',
    SURFACE2: '#30354a',
    SURFACE1: '#303340',
    SURFACE0: '#20232d',
    BASE: '#1b1e28',
    MANTLE: '#1b1e28',
    CRUST: '#1b1e28'
  }
};

const rosepine = {
  name: 'Rosepine',
  mode: 'dark',
  base: '#191724',
  accents: {
    IRIS: '#c4a7e7',
    PINE: '#31748f',
    LOVE: '#eb6f92',
    GOLD: '#f6c177',
    FOAM: '#9ccfd8',
    ROSE: '#ebbcba'
  },
  surface: {
    TEXT: '#e0def4',
    SUBTEXT1: '#908caa',
    SUBTEXT0: '#6e6a86',
    OVERLAY: '#6e6a86',
    SURFACE2: '#524f67',
    SURFACE1: '#403d52',
    SURFACE0: '#26233a',
    BASE: '#191724',
    MANTLE: '#1f1d2e',
    CRUST: '#191724'
  }
};

const sunset = {
  name: 'Sunset',
  mode: 'dark',
  base: '#111111',
  accents: {
    SKY: '#77AAAA',
    GRASS: '#66CC33',
    FIRE: '#EE7711',
    SUN: '#EEEE11',
    WINE: '#775599',
    ROSE: '#EE7777'
  },
  surface: {
    TEXT: '#EEEEEE',
    SUBTEXT1: '#EEEEEE',
    SUBTEXT0: '#777777',
    OVERLAY: '#777777',
    SURFACE2: '#777777',
    SURFACE1: '#333333',
    SURFACE0: '#222222',
    BASE: '#111111',
    MANTLE: '#111111',
    CRUST: '#111111'
  }
};

const vesper = {
  name: 'Vesper',
  mode: 'dark',
  base: '#101010',
  accents: {
    BEIGE: '#ffc799',
    BRIGHT_GREEN: '#99FFE4',
    RED: '#ff8080',
    GRAY: '#A0A0A0',
    WHITE: '#ffffff'
  },
  surface: {
    TEXT: '#ffffff',
    SUBTEXT1: '#ffffff',
    SUBTEXT0: '#A0A0A0',
    OVERLAY: '#8b8b8b',
    SURFACE2: '#A0A0A0',
    SURFACE1: '#505050',
    SURFACE0: '#1C1C1C',
    BASE: '#101010',
    MANTLE: '#101010',
    CRUST: '#101010'
  }
};

const themes = [
  autumn,
  autumnNight,
  carbon,
  curzon,
  everblush,
  focusNova,
  kanagawaDragon,
  onedarker,
  poimandres,
  rosepine,
  sunset,
  vesper
];

const ThemeSection = ({ theme }) => {
  const textColor = theme.mode === 'dark' ? '#cdd6f4' : '#4c4f69';
  const mutedColor = theme.mode === 'dark' ? '#a6adc8' : '#6c6f85';

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: theme.base,
        borderRadius: '12px',
        marginBottom: '24px'
      }}
    >
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: textColor }}>
        {theme.name}
      </h2>
      <p style={{ fontSize: '12px', color: mutedColor, marginBottom: '20px' }}>
        {theme.mode === 'light' ? 'Light theme' : 'Dark theme'} — Base: {theme.base}
      </p>

      <ColorSection title="Accents" colors={theme.accents} textColor={textColor} />
      <ColorSection title="Surface & Text" colors={theme.surface} textColor={textColor} />
    </div>
  );
};

export default {
  title: 'Themes/Helix',
  parameters: {
    layout: 'padded'
  }
};

export const AllThemes = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#0d0c0c', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', color: '#cdd6f4' }}>
        Helix Editor Themes
      </h1>
      <p style={{ fontSize: '14px', color: '#a6adc8', marginBottom: '32px' }}>
        All 12 themes from Helix Editor
      </p>
      {themes.map((theme) => (
        <ThemeSection key={theme.name} theme={theme} />
      ))}
    </div>
  )
};

export const Autumn = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#212121', minHeight: '100vh' }}>
      <ThemeSection theme={autumn} />
    </div>
  )
};

export const AutumnNight = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#111111', minHeight: '100vh' }}>
      <ThemeSection theme={autumnNight} />
    </div>
  )
};

export const Carbon = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#161616', minHeight: '100vh' }}>
      <ThemeSection theme={carbon} />
    </div>
  )
};

export const Curzon = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#000000', minHeight: '100vh' }}>
      <ThemeSection theme={curzon} />
    </div>
  )
};

export const Everblush = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#161d1f', minHeight: '100vh' }}>
      <ThemeSection theme={everblush} />
    </div>
  )
};

export const FocusNova = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#1e1e2e', minHeight: '100vh' }}>
      <ThemeSection theme={focusNova} />
    </div>
  )
};

export const KanagawaDragon = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#0d0c0c', minHeight: '100vh' }}>
      <ThemeSection theme={kanagawaDragon} />
    </div>
  )
};

export const Onedarker = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#12100E', minHeight: '100vh' }}>
      <ThemeSection theme={onedarker} />
    </div>
  )
};

export const Poimandres = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#1b1e28', minHeight: '100vh' }}>
      <ThemeSection theme={poimandres} />
    </div>
  )
};

export const Rosepine = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#191724', minHeight: '100vh' }}>
      <ThemeSection theme={rosepine} />
    </div>
  )
};

export const Sunset = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#111111', minHeight: '100vh' }}>
      <ThemeSection theme={sunset} />
    </div>
  )
};

export const Vesper = {
  render: () => (
    <div style={{ padding: '24px', backgroundColor: '#101010', minHeight: '100vh' }}>
      <ThemeSection theme={vesper} />
    </div>
  )
};
