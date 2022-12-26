import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';

interface HomePageProps {
    message: string;
    setMessage: (newMessage: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ message, setMessage }) => {
    function handleClick() {
        console.log("handleClick was just triggered!");
        setMessage('Button was clicked!');
    }

    return (
        <div>
            <p>{message}</p>
            <button onClick={handleClick}>Click me</button>
        </div>
    );
};

export default HomePage;