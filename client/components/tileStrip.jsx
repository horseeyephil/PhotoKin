import React from 'react'
import {Link} from 'react-router-dom'
import styles from './componentStyles/photoDisplay.css'

const TileStrip = props => (
  <div className={styles.tileStrip}>
    {props.ownPage && <div className={styles.tile + ' ' + styles.uploadButton} onClick={()=>{props.setUploadMode(true)}}>+</div>}
    {props.thumbs && props.thumbs.map((eachPhoto, photoIndex)=>(
      <Link to={`/library/${props.username}/${photoIndex}`} key={eachPhoto.key}>
        <div className={styles.tile}>
          <div className={styles.overLay} />
          <img className= {styles.thumbImage} src={eachPhoto.signedUrl || eachPhoto} />
        </div>
      </Link>))}
  </div>
)

export default TileStrip
