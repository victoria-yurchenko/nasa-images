import React, { useEffect } from 'react';
import './SearchBar.css';
import { useState } from 'react';
import axios from 'axios';

export default function SearchBar({ onResponceChange, onDoRedrawChange }) {

    const [query, setQuery] = useState('');
    const [responce, setResponce] = useState([]);
    const [doRedraw, setDoRedraw] = useState(false);

    useEffect(() => { }, [query]);
    useEffect(() => onResponceChange(responce), [responce]);
    useEffect(() => onDoRedrawChange(doRedraw), [doRedraw]);

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

    function getNasaResponce(event) {

        event.preventDefault();
        axios({
            url: 'https://images-api.nasa.gov/search?q=' + query,
            method: 'GET',
            withCredentials: false
        })
            .then(res => {
                const data = Array.from(res.data.collection.items);
                setResponce(data);
            })
            .catch(error => console.log(error));
        setDoRedraw(true);
    }
}
