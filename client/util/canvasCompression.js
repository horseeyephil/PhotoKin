function canvasCompression(file){

        const wrapper = document.createElement('div')
        wrapper.style.position = 'absolute'

        const image = new Image()
        image.src = URL.createObjectURL(file)
        image.width = 500
        image.style.position = 'relative'
        


        image.onload = function(){
        document.getElementById('uploadTool').appendChild(wrapper)
        wrapper.appendChild(image)

        const overlay = document.createElement('div')
        overlay.style.width = '500px'
        overlay.style.height = '700px'
        overlay.style.backgroundColor = 'blue'
        overlay.style.opacity = .5
        overlay.style.zIndex = 100
        overlay.style.position = 'absolute'
        overlay.style.top = 0

        wrapper.appendChild(overlay)

        performResize(image)



        }

}


function performResize(image){


        const nextHeight = 150
        const nextWidth = 150

        const canvas = document.createElement('canvas')
        canvas.height= 200
        canvas.width= 200

        canvas.style.border='1px solid black'

        const ctx = canvas.getContext("2d");
        console.log('what is this? ', image.naturalWidth, image.naturalHeight)
        ctx.drawImage(image, 1200, 1200, 1000, 1000, 20, 20, 200, 200);

        document.getElementById('uploadTool').appendChild(canvas)



}

export default canvasCompression