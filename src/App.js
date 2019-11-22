import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner';
import './App.css';

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [apiData, setApiData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = "http://openlibrary.org/search.json?author=";
  const AUTHOR_ID = "OL26320A";

  async function fetchData() {
    console.log("Fetching data from : " + API_URL + AUTHOR_ID);
    const res = await fetch(API_URL + AUTHOR_ID);
    res
      .json()
      .then(res => handleData(res))
      .catch(err => setErrors(err));
  }

  const handleData = (res) => {
    console.log("Received Data.");
    setApiData(res);
    //We'll narrow our data to what we need here in order to achieve higher readability.

    setIsLoading(false);
  }

  useEffect(() => {
    if (!apiData) {
      fetchData();
    }
  });

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <Loader
          type="BallTriangle"
          color="#FBC901"
          height={100}
          width={100}
        />
        </header>
    </div>
    );
  };
  if (hasError) {
    return (
      <div className="App">
      <header className="App-header">
        <p>Something went wrong and I swear it's not my fault!</p>
        <p>Here's all I know:</p>
        <p>{JSON.stringify(hasError)}</p>
      </header>
    </div>
    )
  }
  if (apiData) {
    return (
      <div className="App">
      <header className="App-header">
        <p>I have some fancy data :)</p>
      </header>
    </div>
    )
}
}

export default App;
