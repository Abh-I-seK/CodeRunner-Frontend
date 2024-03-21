'use client'
import React from "react"
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_REDIS_URL,
  token: process.env.NEXT_PUBLIC_REDIS_TOKEN,
})

function Row(props){

    return(
        <tr className="bg-white m-1 border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {props.username}
            </th>
            <td className="px-6 py-4 text-center">
                {props.language}
            </td>
            <td className="px-6 py-4 text-center">
                {props.stdinput}
            </td>
            <td className="px-6 py-4 text-center">
                {props.stdoutput}
            </td>
            <td className="px-6 py-4 text-center">
                {convertUTCToIST(props.created)}
            </td>
            <td className="px-6 py-4 text-center">
                {First100(props.sourceCode)}
            </td>
            {props.status.charAt(0) == 'A' ? <td className="px-6 py-4 text-green-500 text-center">{props.status}</td> :  <td className="px-6 py-4 text-red-500 text-center">{props.status}</td>}  
            
        </tr>
    )
}



export default function Table(){
    const router = useRouter();
    const[codes , setCodes] = React.useState([]);

    async function getCachedData(){
        return await redis.get("codes");
    }

    React.useEffect(()=>{
        async function all(){
            setCodes(await getCachedData());
            if(codes.length == 0){
                const resp = await axios.get(process.env.NEXT_PUBLIC_Backend+"/codes");
                setCodes(resp.data.reverse());
                let a =[];
                resp.data.map((e)=>{
                    a.push({"username" : e.username ,  "language" : e.language , "stdinput" : e.stdinput , "stdoutput" : e.stdoutput 
                    , "created" : e.created , "sourceCode": e.sourceCode, "status" : e.status});
                });
                await redis.set("codes",a);    
            }else{
                const start = codes[0].id ;
                let i = start + 1;
                let cach = await redis.get("codes");
                cach = cach.reverse();
                while(true){
                    const res = await axios.get(process.env.NEXT_PUBLIC_Backend+"/codes/" + i);
                    if(res.data.length == 0){
                        break;
                    }
                    const e = res.data[0];
                    let arr = codes.reverse();
                    arr.push(e);
                    setCodes(arr.reverse());
                    cach.push({"username" : e.username ,  "language" : e.language , "stdinput" : e.stdinput , "stdoutput" : e.stdoutput 
                    , "created" : e.created , "sourceCode": e.sourceCode, "status" : e.status});
                    i++;
                }
                cach.reverse();
                await redis.set("codes" , cach);
                
            }
        }
        all();
    },[]);


    return(
        <div>
        <div className="text-center">
        <button onClick={()=>{router.push("/")}} className="text-gray-900 font-semi bold my-10 bg-[#f5ca66c0] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-sm rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 me-2">
            Go Back
        </button>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                            Username
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Language
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            std_inp
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            std_out
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Source Code
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {codes.map((a)=>{
                        return <Row username={a.username} language={a.language} stdinput={a.stdinput} stdoutput={a.stdoutput} created={a.created} status={a.status} sourceCode={a.sourceCode}></Row>
                    })}
                </tbody>
            </table>
        </div>
        </div>
    )
}

function convertUTCToIST(utcDateString) {
  const utcDate = new Date(utcDateString);
  const istOffset = 5.5; 
  const istDate = new Date(utcDate.getTime() + istOffset * 60 * 60 * 1000);
  const year = istDate.getFullYear();
  const month = istDate.getMonth() + 1;
  const date = istDate.getDate();
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const seconds = istDate.getSeconds();

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}
  
  function First100(str){
    return str.substring(0,101);
  }
  