import React from 'react'

const TitleContext = React.createContext({ 
    title: "Intendant", 
    setTitle: () => {},
    setActionType: () => {},
    actionType: "list"
});

//ActionType one of [list,return]

export default TitleContext