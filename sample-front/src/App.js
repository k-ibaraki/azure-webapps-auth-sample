import dotenv from 'dotenv';
import './App.css';
import { useState, useEffect } from 'react';

dotenv.config();

function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState();

  useEffect(() => {

    const apiURL = process.env.REACT_APP_API_URL;
    const frontURL = process.env.REACT_APP_FRONT_URL;

    const fn = async () => {
      // tokenをrefresh
      console.log(apiURL)
      console.log("refresh start")
      await fetch(frontURL + "/.auth/refresh", {
        method: 'GET',
        redirect: 'follow',
        cache: "no-cache",
        credentials: "include",
      });
      console.log("refresh end");

      // idTokenを取得
      const authData = await (await fetch(frontURL + "/.auth/me", {
        method: 'GET',
        redirect: 'follow',
        cache: "no-cache",
        credentials: "include",
      })).json();
      console.log(authData);
      const idToken = "Bearer " + authData[0].access_token;
      console.log(idToken);

      // idTokenをheaderにセット
      const headers = new Headers();
      headers.append("Authorization", idToken);
      const requestOptions = {
        method: 'GET',
        headers: headers,
        cache: "no-cache",
      };
      console.log(requestOptions);

      // API呼び出しにセット
      const text = await (await fetch(apiURL, requestOptions)).text();
      setIsLoaded(true);
      setItem(text);
    };
    fn();
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {item}
      </div>
    );
  }
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <MyComponent />
      </header>
    </div>
  );
}

export default App;
