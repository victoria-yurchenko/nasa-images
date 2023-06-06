import { NasaImage } from '../classModels/NasaImage';

export function getNasaImage(element, url, result, fromNasa) {
    var nasaImage = new NasaImage(
        element.data[0].date_created,
        element.data[0].description,
        element.data[0].title,
        url,
        result
    );

    fromNasa.push(nasaImage);
}
