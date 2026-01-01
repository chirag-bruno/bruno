// Poimandres - Dark Theme
// Based on Helix Editor theme: https://github.com/helix-editor/helix

import { rgba } from 'polished';

const colors = {
  // poimandres Palette
  TEXT: '#e4f0fb',
  SUBTEXT1: '#a6accd',
  SUBTEXT0: '#767c9d',
  OVERLAY2: '#a6accd',
  OVERLAY1: '#767c9d',
  OVERLAY0: '#6c7494',
  SURFACE2: '#30354a',
  SURFACE1: '#303340',
  SURFACE0: '#20232d',
  BASE: '#1b1e28',
  MANTLE: '#1b1e28',
  CRUST: '#1b1e28',

  WHITE: '#fff',
  BLACK: '#000',

  BRAND: '#ADD7FF',
  GREEN: '#5fb3a1',
  RED: '#d0679d',
  YELLOW: '#fffac2',
  BLUE: '#ADD7FF',
  TURQUOISE: '#5DE4c7',

  CODEMIRROR_TOKENS: {
    DEFINITION: '#ADD7FF', // function - matches Helix treesitter function color (blue)
    PROPERTY: '#ADD7FF', // property - matches Helix treesitter property color
    STRING: '#5fb3a1', // string - matches Helix treesitter string color (green)
    NUMBER: '#fffac2', // number - matches Helix treesitter number color (yellow)
    ATOM: '#fffac2', // type - matches Helix treesitter type color (yellow)
    VARIABLE: '#e4f0fb', // variable - matches Helix treesitter variable color (text)
    KEYWORD: '#d0679d', // keyword - matches Helix treesitter keyword color (red)
    COMMENT: '#6c7494', // comment - matches Helix treesitter comment color (muted)
    OPERATOR: '#e4f0fb', // operator - matches Helix treesitter operator color (text)
    TAG: '#ADD7FF', // tag - matches Helix treesitter tag color (blue)
    TAG_BRACKET: '#6c7494' // tag bracket - matches Helix treesitter bracket color (muted)
  }
};

const poimandresTheme = {
  mode: 'dark',
  brand: colors.BRAND,
  text: colors.TEXT,
  textLink: colors.BLUE,
  bg: colors.BASE,

  primary: {
    solid: colors.BRAND,
    text: colors.BRAND,
    strong: colors.BRAND,
    subtle: colors.BRAND
  },

  accents: {
    primary: colors.BRAND
  },

  background: {
    base: colors.BASE,
    mantle: colors.MANTLE,
    crust: colors.CRUST,
    surface0: colors.SURFACE0,
    surface1: colors.SURFACE1,
    surface2: colors.SURFACE2
  },

  overlay: {
    overlay2: colors.OVERLAY2,
    overlay1: colors.OVERLAY1,
    overlay0: colors.OVERLAY0
  },

  font: {
    size: {
      xs: '0.6875rem',
      sm: '0.75rem',
      base: '0.8125rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  },

  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.4)',
    lg: '0 2px 12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.4)'
  },

  border: {
    radius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px'
    },
    border2: colors.SURFACE2,
    border1: colors.SURFACE1,
    border0: colors.SURFACE0
  },

  colors: {
    text: {
      white: colors.WHITE,
      green: colors.GREEN,
      danger: colors.RED,
      warning: colors.YELLOW,
      muted: colors.SUBTEXT0,
      purple: colors.BRAND,
      yellow: colors.YELLOW,
      subtext2: colors.TEXT,
      subtext1: colors.SUBTEXT1,
      subtext0: colors.SUBTEXT0
    },
    bg: {
      danger: colors.RED
    },
    accent: colors.BRAND
  },

  input: {
    bg: 'transparent',
    border: colors.SURFACE1,
    focusBorder: colors.BRAND,
    placeholder: {
      color: colors.OVERLAY0,
      opacity: 0.75
    }
  },

  sidebar: {
    color: colors.TEXT,
    muted: colors.SUBTEXT0,
    bg: colors.BASE,
    dragbar: {
      border: colors.SURFACE0,
      activeBorder: colors.OVERLAY0
    },

    collection: {
      item: {
        bg: colors.SURFACE0,
        hoverBg: colors.SURFACE0,
        focusBorder: colors.SURFACE1,
        indentBorder: `solid 1px ${colors.SURFACE2}`,
        active: {
          indentBorder: `solid 1px ${colors.BRAND}`
        },
        example: {
          iconColor: colors.OVERLAY1
        }
      }
    },

    dropdownIcon: {
      color: colors.TEXT
    }
  },

  dropdown: {
    color: colors.TEXT,
    iconColor: colors.SUBTEXT1,
    bg: colors.SURFACE0,
    hoverBg: rgba(colors.SURFACE1, 0.16),
    shadow: 'none',
    border: rgba(colors.SURFACE1, 0.5),
    separator: colors.SURFACE1,
    selectedColor: colors.BRAND,
    mutedText: colors.SUBTEXT0
  },

  workspace: {
    accent: colors.BRAND,
    border: colors.SURFACE1,
    button: {
      bg: colors.SURFACE0
    }
  },

  request: {
    methods: {
      get: colors.GREEN,
      post: colors.BLUE,
      put: colors.YELLOW,
      delete: colors.RED,
      patch: colors.YELLOW,
      options: colors.TURQUOISE,
      head: colors.TURQUOISE
    },

    grpc: colors.TURQUOISE,
    ws: colors.BRAND,
    gql: colors.BRAND
  },

  requestTabPanel: {
    url: {
      bg: colors.BASE,
      icon: colors.TEXT,
      iconDanger: colors.RED,
      border: `solid 1px ${colors.SURFACE1}`
    },
    dragbar: {
      border: colors.SURFACE0,
      activeBorder: colors.OVERLAY0
    },
    responseStatus: colors.TEXT,
    responseOk: colors.GREEN,
    responseError: colors.RED,
    responsePending: colors.BLUE,
    responseOverlayBg: 'rgba(0, 0, 0, 0.6)',

    card: {
      bg: colors.MANTLE,
      border: 'transparent',
      hr: colors.SURFACE0
    },

    graphqlDocsExplorer: {
      bg: colors.BASE,
      color: colors.TEXT
    }
  },

  notifications: {
    bg: colors.SURFACE0,
    list: {
      bg: colors.SURFACE0,
      borderRight: colors.SURFACE2,
      borderBottom: colors.SURFACE1,
      hoverBg: colors.SURFACE1,
      active: {
        border: colors.BLUE,
        bg: colors.SURFACE2,
        hoverBg: colors.SURFACE2
      }
    }
  },

  modal: {
    title: {
      color: colors.TEXT,
      bg: colors.MANTLE
    },
    body: {
      color: colors.TEXT,
      bg: colors.BASE
    },
    input: {
      bg: 'transparent',
      border: colors.SURFACE1,
      focusBorder: colors.BRAND
    },
    backdrop: {
      opacity: 0.2
    }
  },

  button: {
    secondary: {
      color: colors.TEXT,
      bg: colors.SURFACE0,
      border: colors.SURFACE0,
      hoverBorder: colors.OVERLAY0
    },
    close: {
      color: colors.TEXT,
      bg: 'transparent',
      border: 'transparent',
      hoverBorder: ''
    },
    disabled: {
      color: colors.OVERLAY0,
      bg: colors.SURFACE1,
      border: colors.SURFACE1
    },
    danger: {
      color: colors.CRUST,
      bg: colors.RED,
      border: colors.RED
    }
  },
  button2: {
    color: {
      primary: {
        bg: colors.BRAND,
        text: colors.CRUST,
        border: colors.BRAND
      },
      secondary: {
        bg: colors.SURFACE0,
        text: colors.TEXT,
        border: colors.SURFACE1
      },
      success: {
        bg: colors.GREEN,
        text: colors.CRUST,
        border: colors.GREEN
      },
      warning: {
        bg: colors.YELLOW,
        text: colors.CRUST,
        border: colors.YELLOW
      },
      danger: {
        bg: colors.RED,
        text: colors.CRUST,
        border: colors.RED
      }
    }
  },

  tabs: {
    marginRight: '1.2rem',
    active: {
      fontWeight: 400,
      color: colors.TEXT,
      border: colors.BRAND
    },
    secondary: {
      active: {
        bg: colors.SURFACE0,
        color: colors.TEXT
      },
      inactive: {
        bg: colors.SURFACE1,
        color: colors.SUBTEXT0
      }
    }
  },

  requestTabs: {
    color: colors.TEXT,
    bg: colors.SURFACE0,
    bottomBorder: colors.SURFACE1,
    icon: {
      color: colors.OVERLAY0,
      hoverColor: colors.TEXT,
      hoverBg: colors.BASE
    },
    example: {
      iconColor: colors.OVERLAY1
    }
  },

  codemirror: {
    bg: colors.BASE,
    border: colors.BASE,
    placeholder: {
      color: colors.OVERLAY0,
      opacity: 0.5
    },
    gutter: {
      bg: colors.BASE
    },
    variable: {
      valid: colors.GREEN,
      invalid: colors.RED,
      prompt: colors.BLUE
    },
    tokens: {
      definition: colors.CODEMIRROR_TOKENS.DEFINITION,
      property: colors.CODEMIRROR_TOKENS.PROPERTY,
      string: colors.CODEMIRROR_TOKENS.STRING,
      number: colors.CODEMIRROR_TOKENS.NUMBER,
      atom: colors.CODEMIRROR_TOKENS.ATOM,
      variable: colors.CODEMIRROR_TOKENS.VARIABLE,
      keyword: colors.CODEMIRROR_TOKENS.KEYWORD,
      comment: colors.CODEMIRROR_TOKENS.COMMENT,
      operator: colors.CODEMIRROR_TOKENS.OPERATOR,
      tag: colors.CODEMIRROR_TOKENS.TAG,
      tagBracket: colors.CODEMIRROR_TOKENS.TAG_BRACKET
    },
    searchLineHighlightCurrent: rgba(colors.OVERLAY0, 0.18),
    searchMatch: colors.YELLOW,
    searchMatchActive: colors.YELLOW
  },

  table: {
    border: colors.SURFACE0,
    thead: {
      color: colors.TEXT
    },
    striped: colors.SURFACE0,
    input: {
      color: colors.TEXT
    }
  },

  plainGrid: {
    hoverBg: colors.SURFACE0
  },

  scrollbar: {
    color: colors.SURFACE0
  },

  dragAndDrop: {
    border: colors.BRAND,
    borderStyle: '2px solid',
    hoverBg: rgba(colors.BRAND, 0.08),
    transition: 'all 0.1s ease'
  },
  infoTip: {
    bg: colors.SURFACE0,
    border: colors.SURFACE1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },

  statusBar: {
    border: colors.SURFACE0,
    color: colors.SUBTEXT0
  },

  console: {
    bg: colors.BASE,
    headerBg: colors.MANTLE,
    contentBg: colors.BASE,
    border: colors.SURFACE0,
    titleColor: colors.TEXT,
    countColor: colors.SUBTEXT0,
    buttonColor: colors.TEXT,
    buttonHoverBg: rgba(colors.TEXT, 0.1),
    buttonHoverColor: colors.TEXT,
    messageColor: colors.TEXT,
    timestampColor: colors.SUBTEXT0,
    emptyColor: colors.SUBTEXT0,
    logHoverBg: rgba(colors.TEXT, 0.05),
    resizeHandleHover: colors.BLUE,
    resizeHandleActive: colors.BLUE,
    dropdownBg: colors.MANTLE,
    dropdownHeaderBg: colors.SURFACE0,
    optionHoverBg: rgba(colors.TEXT, 0.05),
    optionLabelColor: colors.TEXT,
    optionCountColor: colors.SUBTEXT0,
    checkboxColor: colors.BRAND,
    scrollbarTrack: colors.MANTLE,
    scrollbarThumb: colors.SURFACE2,
    scrollbarThumbHover: colors.OVERLAY0
  },

  grpc: {
    tabNav: {
      container: {
        bg: colors.CRUST
      },
      button: {
        active: {
          bg: colors.SURFACE0,
          color: colors.TEXT
        },
        inactive: {
          bg: 'transparent',
          color: colors.SUBTEXT0
        }
      }
    },
    importPaths: {
      header: {
        text: colors.SUBTEXT0,
        button: {
          color: colors.SUBTEXT0,
          hoverColor: colors.TEXT
        }
      },
      error: {
        bg: 'transparent',
        text: colors.RED,
        link: {
          color: colors.RED,
          hoverColor: colors.RED
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: rgba(colors.TEXT, 0.05),
        text: colors.TEXT,
        icon: colors.SUBTEXT0,
        checkbox: {
          color: colors.TEXT
        },
        invalid: {
          opacity: 0.6,
          text: colors.RED
        }
      },
      empty: {
        text: colors.SUBTEXT0
      },
      button: {
        bg: colors.SURFACE0,
        color: colors.TEXT,
        border: colors.SURFACE0,
        hoverBorder: colors.OVERLAY0
      }
    },
    protoFiles: {
      header: {
        text: colors.SUBTEXT0,
        button: {
          color: colors.SUBTEXT0,
          hoverColor: colors.TEXT
        }
      },
      error: {
        bg: 'transparent',
        text: colors.RED,
        link: {
          color: colors.RED,
          hoverColor: colors.RED
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: rgba(colors.TEXT, 0.05),
        selected: {
          bg: rgba(colors.BRAND, 0.2),
          border: colors.BRAND
        },
        text: colors.TEXT,
        secondaryText: colors.SUBTEXT0,
        icon: colors.SUBTEXT0,
        invalid: {
          opacity: 0.6,
          text: colors.RED
        }
      },
      empty: {
        text: colors.SUBTEXT0
      },
      button: {
        bg: colors.SURFACE0,
        color: colors.TEXT,
        border: colors.SURFACE0,
        hoverBorder: colors.OVERLAY0
      }
    }
  },
  deprecationWarning: {
    bg: rgba(colors.RED, 0.1),
    border: rgba(colors.RED, 0.1),
    icon: colors.RED,
    text: colors.SUBTEXT1
  },

  examples: {
    buttonBg: rgba(colors.BRAND, 0.1),
    buttonColor: colors.BRAND,
    buttonText: colors.TEXT,
    buttonIconColor: colors.TEXT,
    border: colors.SURFACE1,
    urlBar: {
      border: colors.SURFACE1,
      bg: colors.MANTLE
    },
    table: {
      thead: {
        bg: colors.MANTLE,
        color: colors.SUBTEXT0
      }
    },
    checkbox: {
      color: colors.CRUST
    }
  },

  app: {
    collection: {
      toolbar: {
        environmentSelector: {
          bg: colors.BASE,
          border: colors.SURFACE0,
          icon: colors.BRAND,
          text: colors.TEXT,
          caret: colors.SUBTEXT0,
          separator: colors.SURFACE0,
          hoverBg: colors.BASE,
          hoverBorder: colors.SURFACE1,

          noEnvironment: {
            text: colors.SUBTEXT0,
            bg: colors.BASE,
            border: colors.SURFACE0,
            hoverBg: colors.BASE,
            hoverBorder: colors.SURFACE1
          }
        },
        sandboxMode: {
          safeMode: {
            bg: rgba(colors.GREEN, 0.12),
            color: colors.GREEN
          },
          developerMode: {
            bg: rgba(colors.YELLOW, 0.11),
            color: colors.YELLOW
          }
        }
      }
    }
  }
};

export default poimandresTheme;
