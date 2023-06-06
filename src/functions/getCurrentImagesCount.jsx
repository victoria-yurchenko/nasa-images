import { getNasaImage } from './getNasaImage';

export function getCurrentImagesCount(element, url, result, fromNasa, index) {
    getNasaImage(element, url, result, fromNasa);
    index++;
    return index;
}
