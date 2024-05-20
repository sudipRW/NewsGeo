import React,{useState,useEffect} from 'react'

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timerID = setInterval(() => tick(), 1000);
  
      return () => {
        clearInterval(timerID);
      };
    }, []);
  
    function tick() {
      setTime(new Date());
    }
  
    return (
      <div className='bg-black px-4 py-2 rounded-md'>
        <p className='text-white font-semibold text-sm'>{time.toLocaleTimeString()}</p>
      </div>
    );
}

export default Clock