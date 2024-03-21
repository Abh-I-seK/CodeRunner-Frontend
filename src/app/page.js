'use client'

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { materialDark } from '@uiw/codemirror-theme-material';
import { options } from '@/utils/judge0';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [inp , setInp] = React.useState("");
  const [lang , setLang] = React.useState(93);
  const [name , setName] = React.useState("");

  const onChange = React.useCallback((val, viewUpdate) => {
      setValue(val);
  }, []);

  async function handleSubmit(e){
      if(value.length == 0){
        alert("Please write something in Code Section !!");
        return;
      }
      e.preventDefault();
      const src_code = btoa(value);
      const std_inp = btoa(inp);
      const rapidAPI = options(lang , src_code ,std_inp);
      const response = await axios.request(rapidAPI);
      
      
      const output = atob(response.data.stdout);
      const status = response.data.status.description;
      
      let language = null;
      if(lang == 91){
        language = "Java"
      }else if(lang == 92){
        language = "Python"
      }else if(lang == 93){
        language = "Javascript";
      }else{
        language = "C++"
      }
      try{
        const resp = await axios.post(process.env.NEXT_PUBLIC_Backend +"/newCode" , {
          username : name,
          srcCode : value,
          stdinp : inp,
          lang : language,
          stdout : output,
          status : status
        });
      }catch{
        alert("Backend Issue !!");
      }
      router.push("/dashboard");
      
  }

  return (
    <main className="p-5">
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 text-md font-semibold tracking-wider text-gray-900 dark:text-white">Username</label>
          <input onChange={(e)=>{setName(e.target.value)}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="abc@example" required />
        </div>
        <div className="mb-5">
          <label for="countries" className="block mb-2 text-md font-semibold tracking-wider text-gray-900 dark:text-white">Language</label>
          <select onChange={(e)=>{setLang(parseInt(e.target.value)); if(e.target.value == "91") {alert("Make Sure the Main Method is inside 'class Main' for JAVA")}}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="91" >Java</option> // Try Adding SVG
          <option value="92">Python</option>
          <option value="93" selected>Javascript</option>
          <option value="53">C++</option>
          </select>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-md font-semibold tracking-wider text-gray-900 dark:text-white">Source Code</label>
          <CodeMirror value={value} height="200px" theme={materialDark} extensions={[java()]} onChange={onChange}/>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-md font-semibold tracking-wider text-gray-900 dark:text-white">Standard Input</label>
          <textarea onChange={(e)=>{setInp(e.target.value);}} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Paste Your Inputs Here..." ></textarea>
        </div>
        <button type='submit' className="px-5 py-2.5 w-full text-md font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </main>
  );
}
