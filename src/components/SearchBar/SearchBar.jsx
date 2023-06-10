import React, { useEffect } from 'react';
import './SearchBar.css';
import { useState } from 'react';
import axios from 'axios';
import { NasaImage } from '../../classModels/NasaImage';
import { ReactDOM } from 'react';

export default function SearchBar({
    onDoRedrawChange,
    onNasaImagesChange }) {

    const [query, setQuery] = useState('');
    const [doRedraw, setDoRedraw] = useState(false);
    const [nasaImages, setNasaImages] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => { }, [query]);
    useEffect(() => { }, [dateFrom]);
    useEffect(() => { }, [dateTo]);
    useEffect(() => onDoRedrawChange(doRedraw), [doRedraw]);
    useEffect(() => {
        console.log(nasaImages)
        onNasaImagesChange(nasaImages);
        setDoRedraw(true);
    }, [nasaImages]);


    const searchButton =
        <button
            id='btn-search'
            className='btn-search m-2'
            onClick={(event) => getNasaResponce(event)}
        >Search</button>;

    const searchInput =
        <input
            type='text'
            className='input-search'
            placeholder='Type here...'
            onChange={event => setQuery(event.target.value)}
        />;

    const learnMoreButton =
        <form
            action='https://images.nasa.gov/'
            style={{ display: 'fixed' }}
        >
            <input
                type='submit'
                value={'Learn More'}
                className='btn-learn-more'
            />
        </form>

    const inputDateFrom =
        <input
            type='date'
            className='input-date'
            disabled
            onChange={event => {
                if (dateTo != '' && event.target.value > dateTo) {
                    event.target.value = dateTo;
                    setDateFrom(dateTo);
                }
                else
                    setDateFrom(event.target.value);
            }}
        />;

    const inputDateTo =
        <input
            type='date'
            className='input-date'
            disabled
            onChange={event => {
                if (dateFrom != '' && dateFrom > event.target.value) {
                    event.target.value = dateFrom;
                    setDateTo(dateFrom);
                }
                else
                    setDateFrom(event.target.value);
            }}
        />;

    const submitDateButton =
        <button
            className='btn-submit'
            disabled
            onClick={() => {

                if (nasaImages.length > 1) {

                    let images = [{}];

                    for (let i = 0; i < nasaImages.length; i++) {

                        let img = nasaImages[i];
                        let date = img.dateCreated.substring(0, 10);

                        // console.log(dateFrom + "..." + dateTo);


                        if (dateFrom == '' && dateTo == '')
                            images.push(img);
                        else if (dateFrom == '') {
                            if (date < dateTo)
                                images.push(img);
                        }
                        else if (dateTo == '') {
                            if (date > dateFrom)
                                images.push(img);
                        }
                        else {
                            if (date > dateFrom && date < dateTo) {

                                images.push(img);
                                // console.log(images)

                            }
                        }
                    }

                    // console.log(images);
                    setNasaImages(images);
                    // setDoRedraw(false);
                }

                setDoRedraw(false);
            }}
        >Filter</button>;

    return (
        <div className='container'>
            <nav className='navbar navbar-light'>
                <div className='container-fluid'>
                    <span className='navbar-brand'>
                        {searchInput}
                        {searchButton}
                    </span>
                    <span className='navbar-brand'>
                        {inputDateFrom}
                        {inputDateTo}
                        {submitDateButton}
                    </span>
                    <span className='navbar-brand'>
                        {learnMoreButton}
                    </span>
                </div>
            </nav>
        </div >
    )

    //from the  <div className='container-fluid'></div>
    function lockControls(div) {
        const spans = div.children;

        spans[0].children[1].disabled = true;   // search button
        spans[1].children[0].disabled = true;   // input date from
        spans[1].children[1].disabled = true;   // input date to 
        spans[1].children[2].disabled = true;   // submit date button
    }

    function unlockControls(div) {
        const spans = div.children;

        spans[0].children[1].disabled = false;   // search button
        spans[1].children[0].disabled = false;   // input date from
        spans[1].children[1].disabled = false;   // input date to 
        spans[1].children[2].disabled = false;   // submit date button
    }

    //refactor this method, too long
    async function getNasaResponce(event) {

        event.preventDefault();
        const div = event.target.parentElement.parentElement;
        lockControls(div);

        await axios({
            url: 'https://images-api.nasa.gov/search?q=' + query,
            method: 'GET',
            withCredentials: false
        })
            .then(async data => {

                const responce = Array.from(data.data.collection.items);
                let fromNasa = [];
                // let grayScalesImages = [];
                // let i = 0;
                // let isFirst = true;

                // no need async here!
                for (let i = 0; i < responce.length; i++) {
                    await axios.get(responce[i].href)
                        .then(currentImage => {
                            let data = Array.from(currentImage.data);
                            for (let j = 0; j < data.length; j++) {
                                const sourceUrl = data[j];
                                console.log(1)
                                if (sourceUrl.includes('.jpg')) {
                                    const fromApi = responce[i].data[0];
                                    const image = new NasaImage(
                                        fromApi.date_created,
                                        fromApi.description,
                                        fromApi.title,
                                        sourceUrl
                                    );

                                    fromNasa.push(image);
                                    // const result = convertToGrayScale(image);

                                    // if (isFirst) {
                                    //     isFirst = false;
                                    //     grayScalesImages.push(result);
                                    //     fromNasa.push(image);
                                    // }
                                    // else {
                                    //     if (!includes(grayScalesImages, result)) {
                                    //         grayScalesImages.push(result);
                                    //         fromNasa.push(image);
                                    //     }
                                    // }

                                    // console.log(result)
                                    // console.log(i)
                                    //fromNasa.push(image);
                                }
                            }
                        })
                        .catch(err => console.log(err));
                }
                //console.log(grayScalesImages)
                setNasaImages(fromNasa);
                unlockControls(div);
                //  await writeChanges(fromNasa);
            })
            .catch(error => console.log(error));
        setDoRedraw(false);
    }
}

// function includes(list, obj) {
//  console.log(list.length + ' length')
//  console.log(list.length + ' length')
//     for (let k = 0; k < list.length; k++) {
//         for (let l; l < obj.data.length; l++) {


// console.log(list[k].data[l] != obj.data[l]);

//             if (list[k].data[l] != obj.data[l]){
//                 return false;

//             }
//         }
//     }
//     return true;
// }
/*

*/

function convertToGrayScale(image) {

    const img = document.createElement('img');
    img.source = image.sourceUrl;

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    const context = canvas.getContext('2d');
    img.crossOrigin = 'anonymous';
    context.drawImage(img, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let count = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
        let colour = 0;
        if (count > 383)
            colour = 255;

        imageData.data[i] = colour;
        imageData.data[i + 1] = colour;
        imageData.data[i + 2] = colour;
        imageData.data[i + 3] = 255;
    }

    return imageData;

    // if (i == 0) {
    //     fromNasa.push(image);
    //     grayScalesImages.push(imageData);
    //     // console.log(grayScalesImages);
    //     i++;
    // }
    // else {
    //     for (let i = 0; i < grayScalesImages.length; i++) {
    //         for (let j = 0; j < data.length; j++) {
    //             if (grayScalesImages[i].data[j] != imageData.data[j])
    //             {
    //                 i++;
    //                 return;
    //             }
    //         }
    //     }
    // }

    // console.log('canvas');
}



//save json to file to make the loading process faster
// async function writeChanges(nasaImages) {
//     await nasaImages.map(image => {

//         const jsonData = JSON.stringify(image);

//         const element = document.createElement('a');
//         const file = new Blob([jsonData], { type: 'application/json' });
//         element.href = URL.createObjectURL(file);
//         element.download = 'output.json';
//         document.body.appendChild(element);
//         element.click();
//         document.body.removeChild(element);
//     });
// // }

// function greaterThen(dateResource, dateToCompare) {

//     const date1Splited = dateResource.split('-');

//     const date1Converted = {
//         year: date1Splited[0],
//         month: date1Splited[1],
//         day: date1Splited[2],
//     };

//     const date2Splited = dateToCompare.split('-');

//     const date2Converted = {
//         year: date2Splited[0],
//         month: date2Splited[1],
//         day: date2Splited[2],
//     };

//     if(date1Converted.year < )
// }