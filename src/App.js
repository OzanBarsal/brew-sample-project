import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner';
import './App.css';

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataShrunk, setDataShrunk] = useState(false);
  const API_URL = "http://openlibrary.org/search.json?author=";
  const AUTHOR_ID = "OL26320A";
  const LOADER_COLOR = "#FBC901";
  const [data, setData] = useState();
  let necessaryData = [];

  async function fetchData() {
    console.log("Fetching data from : " + API_URL + AUTHOR_ID);
    const res = await fetch(API_URL + AUTHOR_ID);
    res
      .json()
      .then(res => handleData(res))
      .catch(err => setErrors(err));
  }

  const handleData = (res) => {
    console.log("Received Data.", res);
    setData(res.docs);
  }

  const shrinkData = () => {
    // Here we'll narrow down our data to what we need.
    for (let i=0; i < data.length; i++) {
      // Here we check if the book was published in English and if it is, we'll put it in our necessaryData array.
      if (data[i].language && data[i].language.includes("eng")) {
        let validEntry = {};

        // author_name field returns an array and might have additional writers.
        // Here we create a string that includes all contributing writers and seperates them with "&" sign.
        let authors_str = "";
        for (let z=0; z < data[i].author_name.length; z++) {
          authors_str += data[i].author_name[z];
          if (z !== data[i].author_name.length - 1) {
            authors_str += " & ";
          }
        }

        // We use our authors_str in our necessaryData array's author_name field.
        validEntry["author_name"] = authors_str;
        validEntry["title"] = data[i].title;
        validEntry["first_publish_year"] = data[i].first_publish_year;
        validEntry["edition_count"] = data[i].edition_count;

        // The API returns two fields for publish information, as publish_year which is an array consisting of integer values for years
        // and as publish_date which is an array that returns strings with unstable date formatting.
        // Here we'll check the latest publish year by checking for both arrays and keeping the highest year we found.
        let all_publish_years = [];
        // Here we look for 4 repeating digits in each element in the publish_date array provided from our API and parse our results to int.
        // With this we create and array that takes every publish year as int from the publish_date array which stores it's elements as strings.
        all_publish_years = data[i].publish_date.map(element => parseInt(element.match(/\d{4}/)[0]));
        // Here we combine the publish years we get from the publish_date array with publish_year array from the API that has integer elements already.
        all_publish_years = all_publish_years.concat(data[i].publish_year);
        // After combining every publish year we got, we find the highest one in our combined array and set it as last_publish_year.
        validEntry["last_publish_year"] = Math.max(...all_publish_years);
        // Once we assign every value we need for this project, we push the entry into our necessaryData array.
        necessaryData.push(validEntry);
      }
    }
    setDataShrunk(true);
    setIsLoading(false);
  }

  useEffect(() => {
  if (!data) {
      fetchData();
    } else if (!dataShrunk) {
    shrinkData();
  }
  });

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <Loader
          type="BallTriangle"
          color={LOADER_COLOR}
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
  if (data) {
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
