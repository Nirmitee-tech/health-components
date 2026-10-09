/* Inline 24px stroke icons (stroke width 2, round caps, no fill), as the CareOS screens draw them. */
export const iconPaths = {
    lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 018 0v4'], x: ['M6 6l12 12M18 6L6 18'], check: ['M5 12l5 5L20 7'],
    'chevron-down': ['M6 9l6 6 6-6'], 'chevron-up': ['M6 15l6-6 6 6'], 'chevron-right': ['M9 6l6 6-6 6'], 'chevron-left': ['M15 6l-6 6 6 6'],
    search: ['M11 4a7 7 0 100 14 7 7 0 000-14z', 'M20 20l-4-4'], plus: ['M12 5v14M5 12h14'], minus: ['M5 12h14'],
    more: ['M12 5h.01M12 12h.01M12 19h.01'], 'more-h': ['M5 12h.01M12 12h.01M19 12h.01'],
    calendar: ['M4 6h16v14H4z', 'M4 10h16M8 3v4M16 3v4'], clock: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v5l3 2'],
    video: ['M3 7h12v10H3z', 'M15 10l6-3v10l-6-3'], user: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 21a8 8 0 0116 0'],
    users: ['M9 11a4 4 0 100-8 4 4 0 000 8z', 'M2 21a7 7 0 0114 0', 'M16 3a4 4 0 010 8M22 21a7 7 0 00-5-6.7'],
    bell: ['M6 16V11a6 6 0 0112 0v5l2 2H4z', 'M10 20a2 2 0 004 0'], alert: ['M12 3l10 18H2z', 'M12 10v4M12 17h.01'],
    info: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 11v6M12 7h.01'], 'alert-circle': ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v6M12 16h.01'],
    upload: ['M12 16V4M7 9l5-5 5 5', 'M4 16v4h16v-4'], download: ['M12 4v12M7 11l5 5 5-5', 'M4 20h16'],
    home: ['M3 11l9-7 9 7', 'M5 10v10h14V10'], message: ['M4 5h16v11H8l-4 4z'], settings: ['M12 9a3 3 0 100 6 3 3 0 000-6z', 'M19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14 3h-4l-.5 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2L10 21h4l.5-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z'],
    file: ['M6 3h8l4 4v14H6z', 'M14 3v4h4'], dollar: ['M12 3v18', 'M16 7H10a3 3 0 000 6h4a3 3 0 010 6H7'], pill: ['M10 4a5 5 0 017 7l-6 6a5 5 0 01-7-7z', 'M8 9l7 7'],
    heart: ['M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z'], grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
    menu: ['M4 6h16M4 12h16M4 18h16'], sparkle: ['M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', 'M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z'],
    card: ['M3 6h18v12H3z', 'M3 10h18'], eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
    sort: ['M8 4v16M4 8l4-4 4 4', 'M16 20V4M12 16l4 4 4-4'], 'sort-up': ['M12 19V5M6 11l6-6 6 6'], 'sort-down': ['M12 5v14M6 13l6 6 6-6'],
    flask: ['M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3'], chart: ['M4 20V10M10 20V4M16 20v-7M22 20H2'],
    shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'], code: ['M8 8l-4 4 4 4M16 8l4 4-4 4'], phone: ['M5 3h4l2 5-3 2a11 11 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z'],
    send: ['M4 12l16-8-6 16-2-7z'], mic: ['M12 3a3 3 0 013 3v6a3 3 0 01-6 0V6a3 3 0 013-3z', 'M5 11a7 7 0 0014 0M12 18v3'], camera: ['M3 7h4l2-3h6l2 3h4v13H3z', 'M12 10a4 4 0 100 8 4 4 0 000-8z'],
    paid: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M8 12l3 3 5-6'], unpaid: ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M12 7v6M12 16h.01'],
    'collapse': ['M15 6l-6 6 6 6', 'M20 4v16'], 'expand': ['M9 6l6 6-6 6', 'M4 4v16'], inbox: ['M3 13l3-8h12l3 8v6H3z', 'M3 13h5l1 3h6l1-3h5'],
    building: ['M4 21V5l8-2v18M12 7l8 2v12M8 9h.01M8 13h.01M8 17h.01M16 13h.01M16 17h.01'], 'trash': ['M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3']
  } as const satisfies Record<string, readonly string[]>;

export type IconName = keyof typeof iconPaths;

export const iconNames = Object.keys(iconPaths) as IconName[];
