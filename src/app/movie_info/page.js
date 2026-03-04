"use client"
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState,useRef } from 'react'
import { get_search_movie } from '../movie_server/server'
import { summry } from '../movie_server/server'
import { ai_movies_summary } from '../movie_server/server'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: 20 }}>Loading...</div>}>
      <Summary_page />
    </Suspense>
  )
}
 const Summary_page = () => {
  const movie_summary = useRef("")
const[ai_description,setdescription] = useState("")
const[movie_info,set_movie_info] = useState([])
const[loader,set_loader] = useState(true)
const[all_similier_movies,set_all_similier_movies] = useState([])
const searchParams = useSearchParams();
const id = searchParams.get("id");
console.log("this is id",id)
async function get_info() {
  try{
  let data = await summry(id)
  console.log("genres",data?.data.title)
  set_movie_info([data.data])
  let summary = await ai_movies_summary(data?.data.title);
  console.log(summary?.info)
  setdescription(summary?.info)
   let similier = await get_search_movie(data?.data.genres[0].name)
  set_all_similier_movies(similier?.data)
  if(summary.sucess){
    set_loader(false)
  }
  }catch(err){
return "check connection"
  }
}
useEffect(() => {
  get_info()
}, [])
   let genres = movie_info[0]?.genres.map((item)=>"["+item.name +"]" + " ")
  console.log(genres)
  let production = movie_info[0]?.production_countries.map((item)=>" "+item.name +" ," + " ")
 console.log(movie_info[0]?.genres)
console.log(movie_info)
  return (
    <> 
    <div className='main_info_div'>
      {movie_info.map((item)=>{
        return (<> 
          <div className="hero">
            <div style={{zIndex:'10000',position:'relative'}} className="navbar"> 
    <div style={{color:'white'}}>
      Welcome
    </div>
   <a style={{color:'white',textDecoration:'none'}} className='home' href="/">  home</a> 
    </div>
  <img
    className="backdrop"
    src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
  />
  <div className="overlay"></div>
  <div className="content">
    <h1>{item.original_title}</h1>
     <h3>{item.overview}</h3>
     <h4></h4>
     <div className='rates'> 
            <div className='rates'> <span><h4>{item.release_date}</h4></span> <span>⭐ {item.vote_average}</span></div>
            </div>
              <p>{genres} , production : {production}</p>
              <div> </div>
               <div className='ai_summary'>
              <h2>Ai Genrated Summary</h2>
              {loader && <div>loading summary....</div>}
             <div>{ai_description}</div> 
            </div>
           <h4>{`${Math.floor(item.runtime/60)}h ${item.runtime%60}m`} , language : [{item.original_language}] ,{item.status}</h4>
           <div className='line'></div>
  <h1 className="all-populer-movies" style={{color:'white'}}>All Similier Movies</h1>
   <div className="design_movie_similier_movies">
        { all_similier_movies.map((movie) => (
          <div>
            <img className="image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}height="250" width="200"/>
            <p>{movie.release_date}</p>
          </div>
        ))}
      </div>

       </div>
</div>
        </>)
      })

      }
    </div>
    </>
  )
}
