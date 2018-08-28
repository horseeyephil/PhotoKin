function canvasCompression(dataUrl){

    const image = new Image()
    image.src = dataUrl

    console.log('data maybe ', dataUrl)

    const nextHeight = 200
    const nextWidth = 200

    const canvas = document.createElement('canvas')
    canvas.height= nextHeight
    canvas.width= nextWidth

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, nextWidth, nextHeight);

    document.getElementById('theCanvas').appendChild(image)


}

export default canvasCompression