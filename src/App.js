import './App.css';
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation';
import ResultList from './components/ResultList/ResultList';
import SearchBar from './components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';

function App() {

  const [nasaImages, setNasaImages] = useState([{}]);
  const [doRedraw, setDoRedraw] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { }, [doRedraw]);

  const onDoRedrawChange = (data) => { setDoRedraw(data); }
  const onNasaImagesChange = (data) => { setNasaImages(data); }
  const onIsLoadingChange = (data) => { setIsLoading(data); }

  const searchBar =
    <SearchBar
      onDoRedrawChange={onDoRedrawChange}
      onNasaImagesChange={onNasaImagesChange}
      onIsLoadingChange={onIsLoadingChange}
    />;

  const resultList =
    <ResultList
      doRedraw={doRedraw}
      nasaImages={nasaImages}
    />;

  const loading =
    <LoadingAnimation />;

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
        {
          isLoading
            ? loading
            : resultList
        }
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
