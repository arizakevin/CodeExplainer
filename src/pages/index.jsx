import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';
import styles from "./index.module.css";

export default function Home() {

  const [count, setCounter] = useState(0);
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if(count == 10) {
        return console.log('you have reached your limit')
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({code: codeInput.replace(/\n/g, "\n")}),
      });

      const data = await response.json();
      if(response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log("Result: ", data.result);

      setResult(data.result);
      setCounter(count + 1)
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className={styles.body}>      
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
       <img src='/favicon.ico' className={styles.icon} alt="AI Icon" />
       <h3>Explain me this code</h3>
       <form onSubmit={onSubmit}>
          <textarea
            type='text'
            name='code'
            rows="20"
            cols="50"
            value={codeInput}
            onChange={(e) =>{
                setCodeInput(e.target.value);
                console.log(codeInput);
              }
            } 
            placeholder='Enter some code'
          />
          <input
            type="submit" 
            value="Generate explanation"/>
       </form>
       <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
};
