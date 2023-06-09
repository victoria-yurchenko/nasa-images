import './App.css';
import ResultList from './components/ResultList/ResultList';
import SearchBar from './components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';

function App() {

  const [nasaImages, setNasaImages] = useState([{}]);
  const [doRedraw, setDoRedraw] = useState(true);

  useEffect(() => { }, [doRedraw]);

  const onDoRedrawChange = (data) => { setDoRedraw(data); }
  const onNasaImagesChange = (data) => { setNasaImages(data); /**console.log(nasaImages) */ }

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
      <div
        className='d-inline-flex'
        style={{
          paddingTop: '100px'
        }}>
        {resultList}
      </div>
    )
  }

  function header() {
    return (
      <div
        style={{
          position: 'fixed',
          backgroundImage: "url('https://wallpaperaccess.com/full/1472764.jpg')",
          width: '100%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.405)',
          boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.382)'
        }}
      >
        <span>
          {searchBar}
        </span>
      </div>
    )
  }
}

export default App;
