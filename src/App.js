import './App.css';
import ResultList from './components/ResultList/ResultList';
import SearchBar from './components/SearchBar/SearchBar';
import { useEffect, useState } from 'react';

function App() {

  const [responce, setResponce] = useState([]);
  const [doRedraw, setDoRedraw] = useState(true);

  useEffect(() => {

    


  }, [responce]);
  useEffect(() => { }, [doRedraw]);

  const onResponceChange = (data) => { setResponce(data); }
  const onDoRedrawChange = (data) => { setDoRedraw(data); }

  const searchBar =
    <SearchBar
      onResponceChange={onResponceChange}
      onDoRedrawChange={onDoRedrawChange}
    />;

  const resultList =
    <ResultList
      responce={responce}
      doRedraw={doRedraw}
    />;

  return (
    <div >
      {header()}
      {body()}
    </div>
  );

  function body() {
    return <div className='d-inline-flex'>
      {resultList}
    </div>;
  }

  function header() {
    return <div>
      <span>
        {searchBar}
      </span>
    </div>;
  }
}

export default App;
