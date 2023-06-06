import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button
} from '@mui/material';

export default function InfoDialog({
    isOpen,
    title,
    sourceUrl,
    description,
    dateCreated,
    onIsOpenChange }) {

    async function downloadImage(imageSrc) {

        const image = await fetch(imageSrc);
        const imageBlog = await image.blob();
        const imageURL = URL.createObjectURL(imageBlog);

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = title + '_' + Date.now();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (

        dateCreated != undefined
            ?
            <Dialog open={isOpen} hasCloseButton style={{ maxWidth: "100%", maxHeight: "100%" }} >
                <DialogTitle>
                    <Typography>{title}</Typography>
                </DialogTitle>
                <DialogContent style={{ width: "300px", height: "500px" }}>
                    <img style={{ width: "250px", height: "350px", borderRadius: "8px", border: "3px solid rgba(0, 0, 0, 0.605)" }}
                        src={sourceUrl} alt="Nasa image" />
                    <Typography>{description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Typography>{dateCreated.substring(0, 9)}</Typography>
                    <Button href='https://images.nasa.gov/'>Learn More</Button>
                    <Button onClick={() => downloadImage(sourceUrl)}>Download</Button>
                    <Button onClick={() => onIsOpenChange(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            :
            <div style={{ display: 'none' }}></div>
    )
}
