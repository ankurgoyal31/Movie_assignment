"use server"
import { MongoClient } from "mongodb";
import { description } from "./ai_summry";
let  collection = null;
 
async function connect() {
  if(collection) return collection;
 const client = new MongoClient(`${process.env.MONGO_URI}`);
  await client.connect()
  let db = await client.db("ai_summry");
  collection = await db.collection("summary")
  return collection;
}

export const getPopularMovies  = async(page_number)=> {
   const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}&page=${page_number}`);
  const data = await res.json();
  return data.results.slice(0, 20);
}
export const get_search_movie = async (search_data) => {
   try {
    if (!search_data) {
      return { sucess: false, data: [] };
    }
    if (search_data.startsWith("tt")) {
      let res = await fetch(`https://api.themoviedb.org/3/find/${search_data}?api_key=${process.env.TMDB_KEY}&external_source=imdb_id`);

      let data = await res.json();
 
      if (data.movie_results.length === 0) {
        return { sucess: false, data: [] };
      }

      return { sucess: true, data: data.movie_results };

    } else {

      let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&query=${search_data}`);
      let data = await res.json();
 
      if (data.results.length === 0) {
        return { sucess: false, data: [] };
      }

      return { sucess: true, data: data.results };
    }

  } catch (err) {
     return { sucess: false, data: [] };
  }
};

export  const summry = async(id)=>{
try{
 let res =await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`)
let data = await res.json()
if(!data){
    return {sucess:false,data:[]}
}
return {sucess:true,data:data}
}catch(err){
    return {sucess:false,data:[]}
} 
}

export const ai_movies_summary = async(title)=>{
try{
  let collection = await connect();
  let check = await collection.findOne({title});
  if(check){
    return {info:check.summary,sucess:true}
  }
let summary = await description(title)
await collection.insertOne({title,summary})
return {info:summary,sucess:true}
}catch(err){
  return{sucess:false}
}
}

export const similer = async(id)=>{
 try{
 let res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&with_genres=${id}`) 
 let data = await res.json()
  return {sucess:true,data:data.results}
}catch(err){
  return {sucess:false,data:[]}
}
}
