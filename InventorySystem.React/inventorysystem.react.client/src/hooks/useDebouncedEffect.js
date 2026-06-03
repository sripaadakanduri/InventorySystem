import { useEffect } from "react";

function useDebouncedEffect(callback, dependencies, delay = 400) {
    useEffect(() => {
        const timerId = setTimeout(callback, delay);

        return () => clearTimeout(timerId);
    }, dependencies);
}

export default useDebouncedEffect;
