// Import icons
import notFoundImg from './img/404-notFound.svg';
import iconVN from './icons/iconVN.svg';
import iconUS from './icons/iconUS.svg';
import iconGoogle from './icons/Icon_Google.png';
import iconZalo from './icons/Icon_Zalo.png';
import iconLogoHQ from './icons/logoHQ.png';

import imageGame from './img/gamev1.png';
import imageDefault from './img/imageDefault.png';
import imageBrandNike from './img/brand_nike.png';
import imageBrandCocaCola from './img/brand_coca.png';

export const icons = {
  // Add your icon imports here
  iconVN: iconVN,
  iconUS: iconUS,
  iconGoogle: iconGoogle,
  iconZalo: iconZalo,
  iconLogoHQ: iconLogoHQ,
};

export const LANGUAGES = [
  { code: 'vi' as const, icon: iconVN, label: 'common:vi' },
  { code: 'en' as const, icon: iconUS, label: 'common:en' },
];

export const images = {
  noBranchs: notFoundImg,
  imageGame: imageGame,
  imageDefault: imageDefault,
  imageBrandNike: imageBrandNike,
  imageBrandCocaCola: imageBrandCocaCola,
};

// Export typography components
export const typography = {
  HeadingPrimary: 'heading-primary',
  HeadingSecondary: 'heading-secondary',
  TextBody: 'text-body',
  TextBodySemibold: 'text-body-semibold',
  TextSmall: 'text-small',
};
