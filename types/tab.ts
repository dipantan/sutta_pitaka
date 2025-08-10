import { ReaderScreenProps } from ".";

export type TabStore = {
  items: ReaderScreenProps[];
  addItem: (item: ReaderScreenProps) => void;
  removeItem: (uid: string, author_uid: string) => void;
  getItem: (uid: string, author_uid: string) => ReaderScreenProps | null;
  updateImage: (uid: string, author_uid: string, image: string) => void;
  clearItems: () => void;
};
