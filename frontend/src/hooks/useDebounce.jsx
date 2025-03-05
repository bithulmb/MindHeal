import { useState,useEffect } from "react";

const useDebounce = (value, delay=500) => {
    
    const [debouncedValue, setDebouncedvalue] = useState(value)
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedvalue(value)
        },delay);

        return () => {
            clearTimeout(handler)
        }
    },[value,delay])

    return debouncedValue
}


export default useDebounce;