import React from 'react'

const style = {width: 400, height: 300, border: '5px dotted goldenrod'}

const CompressionForm = props => (
    <div style={style} >PLEASE SELECT YOUR COMPRESSION NOW
    <button onClick={props.handleCompression}>80%</button>
    
    </div>
)

export default CompressionForm