import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";
import "react-awesome-slider/dist/captioned.css";
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'; 

const buttonStyle = {
  padding: "15px",
  borderRadius: "50%",
  background: "red",
  fontSize: "20px",
  marginRight: "10px"
};

const headerStyle = {
  color:'white',
  position:"absolute",
  zIndex:4,
  top:'30%',
  left:'40%'
}

const contentStyle = {
  color:'white',
  textAlign:"center",
  top:'50%',
  left:'25%',
  position:"absolute",
  zIndex:4
}
  
const bgImg = {
  position: "fixed",
  zIndex: 3,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

function sendEmail(email){
  const body = `Здравствуйте, я нашел вашего питомца.%0A-----------%0AС уважением, ${localStorage.user}`;
  window.open(`mailto:${email}?subject=Потерянный зверь&body=${body}`);
}

function Animal(props){
    if(!props.data) return <p>Loading</p>
    const {header,content,img} = props.data;
    return (
        <div>
          <h1 style={headerStyle}>{header}</h1> <br />
          <h2 style={contentStyle}>{content}</h2>
          <img
            style={bgImg}
            alt="Чара (моя собака)"
            src={img}
          />
        </div>
    );
}

export default function Home() {
  const router = useRouter(); // <-- инициализация роутера
  const [animals,setAnimals] = React.useState([]);

  React.useEffect(()=>{
    fetch('/animals.json').then(data=>data.json()).then(data=>setAnimals(data));
  },[]);

  React.useEffect(()=>{
    let user = localStorage.getItem('user');
    if (user===null){
      while (user===null){
        user=prompt("Введите ваше имя пользователя");
        if (!user){
          alert('Обязательно!');
        }
        else {
          localStorage.setItem('user',user);
        }
      }
    }
  },[]);

  function goToShops() {
    router.push('/shops'); 
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Petto</title>
        <meta name="description" content="Социальная сеть для питомцев" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <div style={{ marginBottom: "20px" }}>
          <button style={buttonStyle} onClick={goToShops}>Магазины</button>
        </div>

        <h1>Petto</h1>

        <AwesomeSlider style={{ "--slider-height-percentage": "100%" }}>
          {
            animals.map((data,i)=>
              <div key={i} style={{ zIndex: 2 }} onClick={()=>sendEmail(data?.email)}>
                <Animal data={data} />
              </div>
            )
          }
        </AwesomeSlider>
      </main>

      <footer className={styles.footer}>
        Petto, (c) 2022
      </footer>
    </div>
  )
}