import React, { useEffect, useState } from 'react';
import axios from 'axios';
import imageToBase64 from 'image-to-base64/browser';
import { NasaImage } from '../../classModels/NasaImage';
import InfoDialog from '../InfoDialog/InfoDialog';
import { getCurrentImagesCount } from '../../functions/getCurrentImagesCount';
import Card from '../Card/Card';
import '../Card/Card.css';

export default function ResultList({ 
    responce, 
    doRedraw }) {

    //todo:
    //compare base64 to avoid the same images in the list +- dont know why doesnt work
    //doRedraw is the boolean variable to redraw the window from search component
    //displaying is broken
    //compare sizes of images


    const [nasaImages, setNasaImages] = useState([{}]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState({});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => { setIsReady(true); }, [nasaImages]);
    useEffect(() => { }, [isOpen]);
    useEffect(() => { }, [selectedImage]);

    const onIsOpenChange = (data) => { setIsOpen(data); }
    const onSelectedImageChange = (data) => { setSelectedImage(data); }

    //refactor this method
    const getImages = () => {

        let index = 0;
        let length = 0;
        let fromNasa = [];

        setIsReady(false);

        responce.map(element => {

            axios.get(element.href)
                .then(currentImage => {

                    const data = Array.from(currentImage.data);
                    length += data.filter(url => url.includes('.jpg')).length;

                    data.map(url => {
                        if (url.includes('.jpg'))
                            imageToBase64(url)
                                .then(result => {

                                    index = getCurrentImagesCount(element, url, result, fromNasa, index);
                                    if (index == length)
                                        setListOutOfDuplicates(fromNasa);
                                })
                                .catch(error => console.log(error));
                    })
                })
                .catch(error => console.log(error));
        });
    }

    function getListOutOfDuplicates(list) {

        const uniqueBase64 = [];

        const resultList = list.filter(current => {

            const isDuplicate = uniqueBase64.includes(current.base64);

            if (!isDuplicate) {
                uniqueBase64.push(current.base64)
                return true;
            }

            return false;
        });

        return resultList;
    }

    function setListOutOfDuplicates(list) {

        const filtered = getListOutOfDuplicates(list);
        setNasaImages(filtered);
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