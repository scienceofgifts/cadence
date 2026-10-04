export interface CinemaImage {
  id: string;
  title: string;
  url: string;
  collectionId: string;
  description?: string;
  quote?: string;
  quoteSource?: string;
  caption?: string;
}

export interface CinemaCollection {
  id: string;
  name: string;
  description: string;
}

export const INITIAL_COLLECTIONS: CinemaCollection[] = [
  {
    id: 'col-films',
    name: 'MY FILMS',
    description: 'Favorite scenes, cinematography & film stills',
  },
  {
    id: 'col-personal',
    name: 'PERSONAL',
    description: 'Places, photography & quiet memories',
  },
  {
    id: 'col-inspiration',
    name: 'INSPIRATION',
    description: 'Architecture, landscapes & visual references',
  },
];

export const INITIAL_CINEMA_IMAGES: CinemaImage[] = [
  // MY FILMS
  {
    id: 'img-film-1',
    title: 'The Fellowship of the Ring',
    collectionId: 'col-films',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    quote: 'All we have to decide is what to do with the time that is given to us.',
    quoteSource: 'THE FELLOWSHIP OF THE RING',
    caption: '35mm Film Still · 1999 New Zealand Production',
  },
  {
    id: 'img-film-2',
    title: 'Interstellar',
    collectionId: 'col-films',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    quote: 'We used to look up at the sky and wonder at our place in the stars.',
    quoteSource: 'INTERSTELLAR',
    caption: '70mm IMAX Frame · Hoyte van Hoytema',
  },
  {
    id: 'img-film-3',
    title: 'Blade Runner 2049',
    collectionId: 'col-films',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    quote: 'All the best memories are hers.',
    quoteSource: 'BLADE RUNNER 2049',
    caption: 'Arri Alexa 65 · Roger Deakins, ASC',
  },
  {
    id: 'img-film-4',
    title: '2001: A Space Odyssey',
    collectionId: 'col-films',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    quote: 'The surface of the Earth is the shore of the cosmic ocean.',
    quoteSource: '2001: A SPACE ODYSSEY',
    caption: 'Super Panavision 70 · Stanley Kubrick',
  },

  // PERSONAL
  {
    id: 'img-[#personal-1]',
    title: 'Misty Lake at Dawn',
    collectionId: 'col-personal',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    caption: 'Kyoto morning mist · Leica M10',
    quote: 'A calmer mind makes better work.',
    quoteSource: 'PERSONAL REFLECTION',
  },
  {
    id: 'img-personal-2',
    title: 'Sunlit Studio Desk',
    collectionId: 'col-personal',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    caption: 'Morning light in the studio · 35mm Portra 400',
  },

  // INSPIRATION
  {
    id: 'img-insp-1',
    title: 'Travertine Arch',
    collectionId: 'col-inspiration',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    caption: 'Minimalist stone geometry',
    quote: 'Simplicity is the ultimate sophistication.',
    quoteSource: 'LEONARDO DA VINCI',
  },
  {
    id: 'img-insp-2',
    title: 'Alpine Ridge Fog',
    collectionId: 'col-inspiration',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1600&q=80',
    caption: 'Engadin valley crest · Switzerland',
  },
];
