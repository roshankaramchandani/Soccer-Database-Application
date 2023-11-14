import React,{useState , useEffect} from 'react';

const Slider = props => {

    const [sliderVal, setSliderValVal] = useState(props.value);

    useEffect(() => {
        setSliderValVal(props.value);
      }, [props.value]);

    const handleInputChange = event => {
        console.log(props);
        props.increasedssd(props.name,event.target.value);
        setSliderValVal(event.target.value);
      };

    return(
        <div>
            <input type="range" min={0} max={100} value={sliderVal} onChange={handleInputChange} />
            <div>{sliderVal}</div>
        </div>

    );

};


export default Slider;