import {useEffect, useRef} from 'react';

export function randomIntFromInterval(min,max){
    return Math.floor(Math.random() * (max-min+1) + min)
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  export function reverseLinkedList(head) {
    let previous = null
    let current = head
    let temp = null
    while (current!= null){
        temp = current.next
        current.next = previous
        previous = current
        current = temp
    }
    return previous

  }