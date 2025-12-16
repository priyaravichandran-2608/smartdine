import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();


export function UserProvider({ children }) {
const [history, setHistory] = useState([]);
const addHistory = (entry) => setHistory(h => [entry, ...h].slice(0, 50));


return (
<UserContext.Provider value={{ history, addHistory }}>
{children}
</UserContext.Provider>
);
}


export function useUser() { return useContext(UserContext); }