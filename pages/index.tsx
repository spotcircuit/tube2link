import React from 'react';

const Home = () => {
    const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;

    return (
        <div>
            <h1>YouTube API Key:</h1>
            <p>{apiKey}</p>
        </div>
    );
};

export default Home;
