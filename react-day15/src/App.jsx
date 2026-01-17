import {useState} from 'react'
import './App.css'
import Card from "./Card.jsx";
import Hero from "./Hero";
import "./App.css";
import Creative from "./Creative.jsx";
import CardList from "./CardList.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
             <Creative />
             <CardList />
            
            <Card title="React" description="A JavaScript library for building user interfaces"/>
            <Hero /> 
           
        </>
    )
}

export default App