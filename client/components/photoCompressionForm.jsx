import React from 'react'

const style = {width: 400, height: 300, border: '5px dotted goldenrod'}

const CompressionForm = props => (
    <div style={style} >PLEASE SELECT YOUR COMPRESSION NOW

        <button onClick={_=>props.setUploadQuality(.5)}>50%</button>
        <button onClick={_=>props.setUploadQuality(.6)}>60%</button>
        <button onClick={_=>props.setUploadQuality(.8)}>80%</button>
        <button onClick={_=>props.setUploadQuality(1)}>FULL</button>
    
    </div>
)

export default CompressionForm