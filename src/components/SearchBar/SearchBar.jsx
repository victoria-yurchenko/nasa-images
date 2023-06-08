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

    useEffect(() => { }, [query]);
    useEffect(() => onDoRedrawChange(doRedraw), [doRedraw]);
    useEffect(() => {
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


    return (
        <div className='container'>
            <nav className='navbar navbar-light'>
                <div className='container-fluid'>
                    <span className='navbar-brand'>
                        {searchInput}
                        {searchButton}
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
                    }})
                    .catch(err => console.log(err));
            }
            console.log(fromNasa)
            setNasaImages(fromNasa);
        })
        .catch(error => console.log(error));
        setDoRedraw(false);
    }
}