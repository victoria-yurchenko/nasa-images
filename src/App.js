import './App.css';
import ResultList from './components/ResultList/ResultList';
import SearchBar from './components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';

function App() {

  const [nasaImages, setNasaImages] = useState([{}]);
  const [doRedraw, setDoRedraw] = useState(true);

  useEffect(() => { }, [doRedraw]);

  const onDoRedrawChange = (data) => { setDoRedraw(data); }
  const onNasaImagesChange = (data) => { setNasaImages(data); console.log(nasaImages) }

  const searchBar =
    <SearchBar
      onDoRedrawChange={onDoRedrawChange}
      onNasaImagesChange={onNasaImagesChange}
    />;

  const resultList =
    <ResultList
      doRedraw={doRedraw}
      nasaImages={nasaImages}
    />;

  return (
    <div >
      {header()}
      {body()}
    </div>
  );

  function body() {
    return (
      <div className='d-inline-flex'>
        {resultList}
      </div>
    )
  }

  function header() {
    return (
      <div>
        <span>
          {searchBar}
        </span>
      </div>
    )
  }
}

export default App;
