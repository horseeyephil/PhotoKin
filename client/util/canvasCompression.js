function canvasCompression(file, quality){


        const image = new Image()
        image.src = URL.createObjectURL(file)
                
        return new Promise((resolve, reject)=>{

            image.onload = function(){

            //REFACTOR LATER TO BE CONCURRENT

                performResize(image, quality).toBlob(fullBlob=>{

                    generateThumbnail(image).toBlob(thumbnailBlob=>{
                        resolve([thumbnailBlob, fullBlob])
                    }, 'image/jpeg', .7)

                }, 'image/jpeg', quality)
            }
        })
}


function generateThumbnail(image){

    const canvas = document.createElement('canvas')
    canvas.height= 150
    canvas.width= 150
    canvas.style.border='1px solid black'

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, image.naturalWidth*.2, image.naturalHeight*.2, image.naturalWidth*.6, image.naturalHeight*.6, 0, 0, 150, 150);

    document.getElementById('uploadTool').appendChild(canvas)
    return canvas

}


function performResize(image, quality){

  
        const canvas = document.createElement('canvas')
        canvas.height= image.naturalHeight*quality
        canvas.width= image.naturalWidth*quality
        canvas.style.border='1px solid red'

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        document.getElementById('uploadTool').appendChild(canvas)
        return canvas

}

export default canvasCompression