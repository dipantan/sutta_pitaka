// languages
const Languages = "/languages";

// menus
const MenuById = (id: string, language?: string) =>
  `/menu/${id}?language=${language}`;

// suttaplex -> suttas -> sutta
const SuttaById = (id: string, lang?: string) => `/suttas/${id}?lang=${lang}`;

const BillaraSutta = (id: string, author: string) =>
  `/bilarasuttas/${id}/${author}`;

export { BillaraSutta, Languages, MenuById, SuttaById };
