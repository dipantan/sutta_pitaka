// languages
const Languages = "/languages";

// menus
const MenuById = (id: string, language?: string) =>
  `/menu/${id}?language=${language}`;

// suttaplex -> suttas -> sutta
const SuttaById = (id: string, lang?: string) => `/suttas/${id}?lang=${lang}`;
const SuttaByAuthor = (id: string, authorId: string, lang?: string) =>
  `/suttas/${id}/${authorId}?lang=${lang}`;

const BillaraSutta = (id: string, author: string) =>
  `/bilarasuttas/${id}/${author}`;

const BillaraSuttaByAuthor = (id: string, authorId: string, lang: string) =>
  `/bilarasuttas/${id}/${authorId}?lang=${lang}`;

export {
  BillaraSutta, BillaraSuttaByAuthor, Languages,
  MenuById,
  SuttaByAuthor,
  SuttaById
};

