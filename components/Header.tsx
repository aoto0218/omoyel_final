import React from 'react';

export const Header = () => {
    return (
        <header className="py-6 px-4 bg-white">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-bold">
                    <span className="text-indigo-400">OMOYEL</span>
                    <span className="text-indigo-300 text-xl ml-2">サロン見学予約</span>
                </h1>
            </div>
        </header>
    );
};