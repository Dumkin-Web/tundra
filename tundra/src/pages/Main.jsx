import React from "react"
import style from '../style/Main.module.css'

const Main = () => {
  return (
    <main style={{height: "auto"}}>
      <div className={style.bg_container}>
        <img src="tundra.jpg" alt="Tundra" className={style.bg_img}/>
        <div className={style.bg_filter}></div>
      </div>
      hihihih
    </main>
  )
};

export default Main;
