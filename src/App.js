import React,{useEffect,useState} from 'react'
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {FaShare,FaDownload} from "react-icons/fa";
import {MdClose} from "react-icons/md";
import "./App.css";
export default function Demo() {
  const[gallery,setGallery]=useState([]);
  const[query,setQuery]=useState('animals');
  const[src,setSrc]=useState('');
  const[close,setClose]=useState();
  const[visible,setVisible]=useState();
  const[img,setImg]=useState({});
  const categories=[
    'fashion', 
    'nature',
    'science',
    'education',
    'feelings',
    'health',
    'people',
    'religion',
    'places',
    'animals', 
    'industry',
    'computer', 
    'food',
    'sports',
    'transportation',
    'travel',
    'buildings', 
    'business',
    'music'
    ];
  useEffect(()=>{
    /* fetching the API data using pixAbay api*/
    axios.get(`https://pixabay.com/api/?key=33354789-080f30e2240fbecc7cb3ab93e&category=${query}&image_type=photo`)
    .then(res=>setGallery(res.data.hits))
    .catch(err=>console.log(err.message))
  },[query])
 
 

  const validating = () => {
    const searchValue = document.querySelector(".search-bar");
    setQuery(searchValue.value);
    axios
      .get(
        `https://pixabay.com/api/?key=33354789-080f30e2240fbecc7cb3ab93e&category=${query}&image_type=photo`
      )
      .then((res) => setGallery(res.data.hits))
      .catch((err) => console.log(err.message));
    searchValue.value = "";
  };
    
  const searching = async () => {
    const searchValue = document.querySelector(".search-bar");
    if (searchValue.value === "") {
      return window.alert("please enter your search item");
    } else {
      return validating();
    }
  };


  return (
    <div className="app">
      <h2>Gallery App</h2>
      <div className="main">
      <div className="search-box">
        <input list="categories"className="search-bar"
        placeholder="type nature, sports etc.."/>
         <datalist id="categories">
            {Array.from(categories, (category) => {
              return (
                <option value={category} style={{ fontFamily: "helvetica" }} />
              );
            })}
          </datalist>
        <button className="search-button"onClick={searching}>Search</button>
      </div>
      <div className="container mt-5">
      <div className="grid-gallery">
        <div className="add-photo"
        onClick={()=>{
          setVisible(prevState=>!prevState);
          /*opening the camera when the clicks on the button using mediaDevices API */
          navigator.mediaDevices.getUserMedia({video:true,width:100,height:100})
          .then(mediastream=>{
            let receivedMediaStream;
            const video=document.createElement('video');
            const camera=document.querySelector('.camera');
            const closeCamera=document.querySelector('.camera-close');
            const capturePhoto=document.querySelector('.capture-photo');
            const galler=document.querySelector('.grid-gallery');
            //const rearCamera=document.querySelector('.rear-camera-button');
            video.srcObject=mediastream;
            video.autoplay=true;
            camera.appendChild(video);
            closeCamera.onclick=()=>{
              setVisible(prevState=>!prevState);
              receivedMediaStream.getTracks().forEach(track=>track.stop())
            }
        capturePhoto.onclick=()=>{ 
          /*capturing the image and producing image from the promise object using Image Capture API */  
          const image=new ImageCapture(mediastream.getVideoTracks()[0]);
              image.takePhoto()
              .then((blob)=>{
                const url=URL.createObjectURL(blob);
                const date=new Date();
                const photo={id:date,largeImageURL:url};
                setGallery([...gallery,photo]);
                setVisible(prevState=>!prevState);
                /*When user photo is captured I want to make sure that photo is captured,after capture scrollbar position points to captured image position*/
                galler.lastElementChild.scrollIntoView ({behavior:'smooth',block:'start',inline:'nearest'});
              })
              .catch(err=>console.log(err))
            }
            
          }
          )
          .catch(err=>console.log(err))
          }}
        >
          <h6>Add photo</h6>
        </div>
        {visible &&<div className="camera-overlay">
        <div className="camera-content"><span><MdClose className="camera-close"/></span>
          <div className="camera"></div>
        </div>
        <div className="camera-buttons">
          <button className="capture-photo">Take Photo</button>
        </div>
        </div>}
      {gallery.map((item)=>{
      const{id,largeImageURL
      }=item;
      return <div key={id}>
        <img src={largeImageURL
}alt=""loading="lazy"onClick={(e)=>{
  setSrc(e.target.src)
  setClose(prevState=>!prevState)
  const individualImage=gallery.find((el)=>el.id===id);
  setImg(individualImage);
}}/>
{ close &&<div className="overlay">
  <div className="icons">
<FaDownload onClick={async()=>{
  /*downlaoding the image using blob method*/
  const{id,largeImageURL}=img;
  await fetch(largeImageURL)
  .then((res)=>res.blob()
  .then((data)=>{
    const url=URL.createObjectURL(data);
    const anchor=document.createElement('a');
    anchor.href=url;
    anchor.download=`${id}.jpeg`;
    document.body.appendChild(anchor);
    anchor.click();
  }))
  .catch(err=>console.log(err))
} 
}/>
<FaShare onClick={async()=>{
  /*sharing the image using web share API*/
  const{largeImageURL}=img;
  await fetch(largeImageURL)
  .then(res=>res.blob()
    .then(myblob=>{
      const file=new File([myblob],'share.jpeg',{type:myblob.type});
      const data={
        files:[file]
      }
      if(navigator.canShare && navigator.canShare(data)){
        try{
navigator.share(data);
        }
        catch{
          console.log('unable to send file')
        }
      }
    })
    .catch(err=>console.log(err)))
  .catch(err=>console.log(err.message))
}}/>
<MdClose id="close"onClick={()=>setClose(prevState=>!prevState)}/>
  </div>
  <div className="overlay-content">
   <img src={src}alt=""className="overlay-image"/>
  </div>
</div>}
      </div>
    })}
   </div>
      </div>
      </div>
    </div>
  )
}