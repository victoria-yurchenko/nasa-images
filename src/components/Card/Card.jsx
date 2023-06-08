import React from 'react';
import { NasaImage } from '../../classModels/NasaImage';

export default function Card({
    dateCreated, 
    description, 
    title, 
    sourceUrl, 
    onSelectedImageChange, 
    onIsOpenChange}) {
    
    const getCurrentImage = (event) => {
      
        const currentNode = event.target;
        const imageStr = currentNode.parentElement.children[0].innerHTML;
        const imageProperties = imageStr.split('+');
        const nasaImage = new NasaImage(
            imageProperties[0],             // dateCreated
            imageProperties[1],             // description
            imageProperties[2],             // title
            imageProperties[3]              // sourceUrl
        );
        onSelectedImageChange(nasaImage);
        onIsOpenChange(true);
    }

    return (
        <div className='card-container'>
            <div style={{ display: "none" }} >
                {dateCreated}+{description}+{title}+{sourceUrl}
            </div>
            <img src={sourceUrl} alt={title} className='card-inner' onClick={getCurrentImage} />
        </div>
    )
}
