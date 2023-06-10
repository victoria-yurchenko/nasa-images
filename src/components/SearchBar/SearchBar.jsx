import React, { useEffect } from 'react';
import './SearchBar.css';
import { useState } from 'react';
import axios from 'axios';
import { NasaImage } from '../../classModels/NasaImage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SearchBar({
    onDoRedrawChange,
    onNasaImagesChange,
    onIsLoadingChange }) {

    const [query, setQuery] = useState('');
    const [doRedraw, setDoRedraw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nasaImages, setNasaImages] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => { }, [query]);
    useEffect(() => { }, [dateFrom]);
    useEffect(() => { }, [dateTo]);
    useEffect(() => {
        onIsLoadingChange(isLoading);
    }, [isLoading]);
    useEffect(() => onDoRedrawChange(doRedraw), [doRedraw]);
    useEffect(() => {
        setIsLoading(false);
        onNasaImagesChange(nasaImages);
        setDoRedraw(true);
    }, [nasaImages]);

    const searchButton =
        <button
            id='btn-search'
            className='btn-search m-2'
            onClick={event => {
                if (query.trim() != '')
                    getNasaResponce(event);
                else
                    toast('Enter the search field!');
            }}
        >Search</button>;

    const searchInput =
        <input
            type='text'
            className='input-search'
            placeholder='Type here...'
            onChange={event => {
                setQuery(event.target.value);
                const div = event.target.parentElement.parentElement;
                lockControls(div);
                div.children[0].children[1].disabled = false;
            }}
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
                    setDateTo(event.target.value);
            }}
        />;

    const submitDateButton =
        <button
            className='btn-submit'
            onClick={(event) => {

                try {
                    const div = event.target.parentElement.parentElement;
                    if (nasaImages.length != 0) {
                        lockControls(div);
                        filter(div);
                        setDoRedraw(false);
                    }
                    else
                        toast('Nothing to filter!')
                }
                catch (error) {
                    console.log(error);
                }
            }}

        > Filter</button >;

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
            <ToastContainer />
        </div >
    )

    function filter(div) {

        let images = [];

        for (let i = 0; i < nasaImages.length; i++) {

            let img = nasaImages[i];
            let date = img.dateCreated.substring(0, 10);

            if (dateFrom.trim() == '' && dateTo.trim() == '')
                images.push(img);
            else if (dateFrom == '' && date <= dateTo)
                images.push(img);
            else if (dateTo == '' && date >= dateFrom)
                images.push(img);
            else if (date >= dateFrom && date <= dateTo)
                images.push(img);
        }

        div.children[0].children[1].disabled = false;
        setNasaImages(images);
    }

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

                setIsLoading(true);
                const responce = Array.from(data.data.collection.items);
                let fromNasa = [];

                // no need async here! Need to fully initialize the array before useState
                for (let i = 0; i < responce.length; i++) {
                    await axios.get(responce[i].href)
                        .then(currentImage => {
                            let data = Array.from(currentImage.data);
                            for (let j = 0; j < data.length; j++) {
                                const sourceUrl = data[j];

                                //need to add the loading animation here
                                console.log('loading...');

                                // raw variant, loosing too much images
                                if (sourceUrl.includes('.jpg')) {
                                    const fromApi = responce[i].data[0];
                                    const image = new NasaImage(
                                        fromApi.date_created,
                                        fromApi.description,
                                        fromApi.title,
                                        sourceUrl
                                    );
                                    fromNasa.push(image);
                                    break;
                                }
                            }
                        })
                        .catch(err => console.log(err));
                }
                setNasaImages(fromNasa);
                unlockControls(div);
            })
            .catch(error => console.log(error));
        setDoRedraw(false);
    }
}



//save json to file to make the loading process faster next time
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