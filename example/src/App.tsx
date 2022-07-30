import { Suspense } from "react";
import "./App.css";
import { PetList } from "./components/PetList";


function App() {
  return (
    <div className="App">
      <h1>Pet List</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <PetList/>
      </Suspense>
    </div>
  );
}

export default App;
