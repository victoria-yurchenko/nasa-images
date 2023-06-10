import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NasaImage } from '../../classModels/NasaImage';
import InfoDialog from '../InfoDialog/InfoDialog';
import Card from '../Card/Card';
import '../Card/Card.css';

export default function ResultList({
    nasaImages,
    doRedraw }) {

    //todo:
    //convert image to gray-scale, compare pixels == too long comparing

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});


    useEffect(() => { }, [isOpen]);
    useEffect(() => { }, [selectedImage]);

    const onIsOpenChange = (data) => { setIsOpen(data); }
    const onSelectedImageChange = (data) => { setSelectedImage(data); }


    return (
        <div className='row' >
            {
                doRedraw
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