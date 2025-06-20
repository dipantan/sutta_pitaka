// languages
const Languages = "/languages";
const TransalationCount = (iso_code: string) =>
  `/translation_count/${iso_code}`;

// menus
const Menu = "/menu";
const MenuById = (id: string, language?: string) =>
  `/menu/${id}?language=${language}`;



// suttaplex -> suttas -> sutta
const DighaNikaya = (_lang: string) => `/suttaplex/long`;
const MajjhimaNikaya = (_lang: string) => `/suttaplex/middle`;
const SamyuttaNikaya = (_lang: string) => `/suttaplex/linked`;
const AnguttaraNikaya = (_lang: string) => `/suttaplex/numbered`;
const KhuddakaNikaya = (_lang: string) => `/suttaplex/minor`;
const SuttaPlexById = (id: string) => `/suttaplex/${id}`;

export {
  AnguttaraNikaya,
  DighaNikaya,
  KhuddakaNikaya,
  Languages,
  MajjhimaNikaya,
  Menu,
  MenuById,
  SamyuttaNikaya,
  SuttaPlexById,
  TransalationCount
};

