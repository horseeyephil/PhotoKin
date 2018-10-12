import React from 'react'
import styles from './componentStyles/uploader.css'

const CompressionForm = props => (
    <div className={styles.compressionForm} >
    <h4>Select Compression</h4>
        <div><input type='radio' className={styles.compressionSelector} name='compress' onChange={_=>props.setUploadQuality(.5)}/>50%</div>
        <div><input type='radio' className={styles.compressionSelector} name='compress' onChange={_=>props.setUploadQuality(.6)}/>60%</div>
        <div><input type='radio' className={styles.compressionSelector} name='compress' onChange={_=>props.setUploadQuality(.8)}/>80%</div>
        <div><input type='radio' className={styles.compressionSelector} name='compress' onChange={_=>props.setUploadQuality(1)}/>Full Quality</div>
    
    </div>
)

export default CompressionForm