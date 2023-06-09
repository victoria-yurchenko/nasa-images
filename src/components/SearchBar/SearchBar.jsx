import React, { useEffect } from 'react';
import './SearchBar.css';
import { useState } from 'react';
import axios from 'axios';
import { NasaImage } from '../../classModels/NasaImage';

export default function SearchBar({
    onDoRedrawChange,
    onNasaImagesChange }) {

    const [query, setQuery] = useState('');
    const [doRedraw, setDoRedraw] = useState(false);
    const [nasaImages, setNasaImages] = useState([{}]);
    const [dateFrom, setDateFrom] = useState([{}]);
    const [dateTo, setDateTo] = useState([{}]);

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
            onChange={event => setDateFrom(event.target.value)}
        />;

    const inputDateTo =
        <input
            type='date'
            className='input-date'
            onChange={event => {
                if (dateTo < dateFrom) {
                    event.target.value = event.target.value.substring(0, 10);
                }
                else
                    setDateTo(event.target.value);
            }}
        />;

    const submitDateButton =
        <button
            className='btn-submit'
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
        >Submit</button>;

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
                    <span className='navbar-brand'>{learnMoreButton}</span>
                </div>
            </nav>
        </div >
    )

    //refactor this method, too long
    async function getNasaResponce(event) {

        event.preventDefault();
        await axios({
            url: 'https://images-api.nasa.gov/search?q=' + query,
            method: 'GET',
            withCredentials: false
        })
            .then(async data => {

                const responce = Array.from(data.data.collection.items);
                let fromNasa = [];

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
                                }
                            }
                        })
                        .catch(err => console.log(err));
                }
                setNasaImages(fromNasa);
                //  await writeChanges(fromNasa);
            })
            .catch(error => console.log(error));
        setDoRedraw(false);
    }
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