import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NasaImage } from '../../classModels/NasaImage';
import InfoDialog from '../InfoDialog/InfoDialog';
import Card from '../Card/Card';
import '../Card/Card.css';

export default function ResultList({
    responce,
    doRedraw }) {

    //todo:
    //convert image to gray-scale, compare pixelsyy

    const [nasaImages, setNasaImages] = useState([{}]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => setIsReady(true), [nasaImages]);
    useEffect(() => { }, [isReady])
    useEffect(() => { }, [isOpen]);
    useEffect(() => { }, [selectedImage]);

    const onIsOpenChange = (data) => { setIsOpen(data); }
    const onSelectedImageChange = (data) => { setSelectedImage(data); }

    //refactor this method
    const getImages = () => {

        let fromNasa = [];

        setIsReady(false);

        for (let i = 0; i < responce.length; i++) {

            axios.get(responce[i].href)
                .then(currentImage => {
                    let data = Array.from(currentImage.data);

                    for (let j = 0; j < data.length; j++) {

                        const sourceUrl = data[j];

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
    }


    return (
        <div className='row' >
            <button onClick={getImages}></button>
            {
                doRedraw && isReady
                    ?
                    displayList()
                    :
                    nothingToDisplay()
            }
        </div>
    )

    function nothingToDisplay() {
        return <div style={{ display: 'none' }}></div>;
    }


    function displayList() {
        return <div className='card-container m-4 flex-wrap'>
            {displayCards()}
            {createInfoDialog()}
        </div>;
    }

    function displayCards() {
        return nasaImages.map((image, key) => createCard(key, image));
    }

    function createCard(key, image) {
        return <Card
            key={key}
            dateCreated={image.dateCreated}
            description={image.description}
            title={image.title}
            sourceUrl={image.sourceUrl}
            onSelectedImageChange={onSelectedImageChange}
            onIsOpenChange={onIsOpenChange} />;
    }

    function createInfoDialog() {
        return <InfoDialog
            isOpen={isOpen}
            title={selectedImage.title}
            sourceUrl={selectedImage.sourceUrl}
            description={selectedImage.description}
            dateCreated={selectedImage.dateCreated}
            onIsOpenChange={onIsOpenChange} />;
    }
}