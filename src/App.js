import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import KanbanBoard from './components/KanbanBoard';
import './App.scss';

const App = () => {
  const [hasError, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataShrunk, setDataShrunk] = useState(false);
  const API_URL = 'http://openlibrary.org/search.json?author=';
  const AUTHOR_ID = 'OL26320A';
  const LOADER_COLOR = '#FBC901';
  const [apiData, setApiData] = useState();
  const [necessaryData, setNecessaryData] = useState();

  async function fetchData() {
    console.log(
      'Fetching data from : ' + API_URL + AUTHOR_ID + 'lang=eng&limit=1000'
    );
    const res = await fetch(API_URL + AUTHOR_ID + 'lang=eng&limit=1000');
    res
      .json()
      .then(res => handleData(res))
      .catch(err => setErrors(err));
  }

  const handleData = res => {
    console.log('Received Data.', res);
    setApiData(res.docs);
  };

  const shrinkData = () => {
    // Here we'll narrow down our data to what we need.
    let shrunkData = [];
    for (let i = 0; i < apiData.length; i++) {
      // Here we check if the book was published in English and if it is, we'll put it in our necessaryData array.
      if (apiData[i].language && apiData[i].language.includes('eng')) {
        let validEntry = {};

        // author_name field returns an array and might have additional writers.
        // Here we create a string that includes all contributing writers and seperates them with "&" sign.
        let authors_str = '';
        for (let z = 0; z < apiData[i].author_name.length; z++) {
          authors_str += apiData[i].author_name[z];
          if (z !== apiData[i].author_name.length - 1) {
            authors_str += ' & ';
          }
        }

        // We use our authors_str in our necessaryData array's author_name field.
        validEntry['author_name'] = authors_str;
        validEntry['title'] = apiData[i].title;
        validEntry['first_publish_year'] = apiData[i].first_publish_year;
        validEntry['edition_count'] = apiData[i].edition_count;
        validEntry['key'] = i;

        // The API returns two fields for publish information, as publish_year which is an array consisting of integer values for years
        // and as publish_date which is an array that returns strings with unstable date formatting.
        // Here we'll check the latest publish year by checking for both arrays and keeping the highest year we found.
        let all_publish_years = [];
        // Here we look for 4 repeating digits in each element in the publish_date array provided from our API and parse our results to int.
        // With this we create and array that takes every publish year as int from the publish_date array which stores it's elements as strings.
        if (apiData[i].publish_date) {
          all_publish_years = apiData[i].publish_date.map(element =>
            parseInt(element.match(/\d{4}/)[0])
          );
        }
        // Here we combine the publish years we get from the publish_date array with publish_year array from the API that has integer elements already.
        all_publish_years = all_publish_years.concat(apiData[i].publish_year);
        // After combining every publish year we got, we find the highest one in our combined array and set it as last_publish_year.
        if (Math.max(...all_publish_years)) {
          validEntry['last_publish_year'] = Math.max(...all_publish_years);
          // Once we assign every value we need for this project, we push the entry into our necessaryData array.
          shrunkData.push(validEntry);
        }
      }
    }
    setNecessaryData(shrunkData);
    console.log('Valid Entry Count : ', shrunkData.length);
    setDataShrunk(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!apiData) {
      fetchData();
    } else if (!dataShrunk) {
      shrinkData();
    }
  });

  if (isLoading) {
    return (
      <div className="App-loading">
        <header className="Loading-header">
          <Loader
            type="BallTriangle"
            color={LOADER_COLOR}
            height={100}
            width={100}
          />
        </header>
      </div>
    );
  }
  if (hasError) {
    return (
      <div className="App-error">
        <header className="App-header">
          <p>Something went wrong and I swear it's not my fault!</p>
          <p>Here's all I know:</p>
          <p>{JSON.stringify(hasError)}</p>
        </header>
      </div>
    );
  }
  if (dataShrunk) {
    return (
      <div className="App">
        <KanbanBoard data={necessaryData} />
      </div>
    );
  }
};

export default App;
