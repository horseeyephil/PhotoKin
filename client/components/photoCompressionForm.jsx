import React from 'react'
import styles from './componentStyles/uploader.css'

const CompressionForm = props => (
    <div className={styles.compressionForm} >PLEASE SELECT YOUR COMPRESSION NOW

        <button onClick={_=>props.setUploadQuality(.5)}>50%</button>
        <button onClick={_=>props.setUploadQuality(.6)}>60%</button>
        <button onClick={_=>props.setUploadQuality(.8)}>80%</button>
        <button onClick={_=>props.setUploadQuality(1)}>FULL</button>
    
    </div>
)

export default CompressionForm