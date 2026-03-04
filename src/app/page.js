'use client'
import React from "react";
import { useState,useEffect } from "react";
import { getPopularMovies } from "./movie_server/server";
import { get_search_movie } from "./movie_server/server";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter()
  const [search_movie,set_search_movie] = useState("")
  const[movies,set_movies] = useState([])
  const[loader,set_loader] = useState(true)
  const[err,set_err] = useState(false)
  const[show_back,set_show_back] = useState(false)
  const[search_err,set_search_err] = useState(false)
  const[filter,set_filter] = useState([])
   async function get() {
     try{
      let  arr = [1,2,3,4,5,6,7,8,9,10];
      let random = Math.floor(Math.random()*arr.length)+1
      console.log(random)
     const get_all_movies = await getPopularMovies(random);
     if(get_all_movies.length>0){
      set_loader(false);
     }
     set_movies(get_all_movies)
     set_filter(get_all_movies)
    }catch(err){
      set_err(true)
      set_loader(false)
    }
   }
   const ai_summry = async(id)=>{
    console.log(id)
    router.push(`/movie_info?id=${id}`)
   }
   useEffect(() => {
        get()
  }, [])
console.log(movies)
  const find = async() =>{
     try{
      console.log("call")
     set_err(false)
     let data=await get_search_movie(search_movie);
      if(!data.sucess && data.data.length===0){
       set_search_err(true)
       set_loader(false);
       set_err(false)
       set_movies([])
       set_show_back(true)
       setTimeout(() => {
       set_err(false) 
       set_show_back(false)
       set_search_err(false)
       get()
       },2000);
     }else{
      console.log("all movies")
      console.log(data)
      set_movies(data.data)
      set_show_back(true)
     }
      }catch(err){
console.log("nothing....")
     }
  } 
  let filter_movies = filter.filter(item => item.vote_average >=7.5||item.vote_average >=7||item.vote_average >=6).slice(0, 5);
   return (
    <div> 
       <div className="navbar"> 
    <h3>
      Welcome
    </h3>
    <div>
      <input value={search_movie} onChange={(e)=>set_search_movie(e.target.value)} type="text" placeholder="enter movie name" />
      <span><button onClick={find} className="search-btn">search</button></span>
    </div>
    </div>

<div className="hero_movie" style={{display:'flex'}}> {
       filter_movies.length>0 && filter_movies.map((item)=>{
        return <>
        <div onClick={()=>ai_summry(item.id)} className="hero_box"> 
             <img  className="hero_image" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}height="250" width="200"/>
             <div class="overlay"></div>
                     <div className="movie_title">{item.title}</div>
        </div>
        </>
       }) 
      }  </div>
     {loader && <><h3 style={{color:'white',justifySelf:'center'}}>loading....</h3></>}
    {err && <><h3 style={{color:'white',justifySelf:'center'}}>check your connection....</h3></>}
    {search_err && <><h3 style={{color:'white',justifySelf:'center'}}>invalid search....</h3></>}
    {!show_back && <h1 className="all-populer-movies" style={{color:'white'}}>Popular Movies</h1>}
    {show_back && <span><a style={{color:'white',textDecoration:'none',marginTop:'10%'}} href="/">⬅ Back</a> </span>}

      <div style={{marginTop:'10px'}} className="design_movie">
        { movies.map((movie) => (
          <div onClick={()=>ai_summry(movie.id)} className="each-movie" key={movie.id}>
            <img className="image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}height="250" width="200"/>
            <p>{movie.release_date}</p>
          </div>
        ))}
      </div>
     </div>
  );
}
