import React,{ useState, useEffect,useRef } from "react";
import { Radar } from "react-chartjs-2";


const RadarGraph = props => {
    const [data, setData] = useState([1,1]);
    const [labels, setLabels] = useState(['a','b']);
    const [chartRef, setChartRef] = useState(useRef());
    useEffect(() => {
        setData(props.value);
        setLabels(props.label);
      
      }, [props.value]);


    const RadarData = {
        labels: {labels},
        datasets: [
          {
            label: "March",
            backgroundColor: "rgba(34, 202, 236, .2)",
            borderColor: "rgba(34, 202, 236, 1)",
            pointBackgroundColor: "rgba(34, 202, 236, 1)",
            poingBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(34, 202, 236, 1)",
            data: {data}
          }
        ]
      };
       const RadarOptions = {
        scale: {
          ticks: {
            min: 0,
            max: 16,
            stepSize: 2,
            showLabelBackdrop: false,
            backdropColor: "rgba(203, 197, 11, 1)"
          },
          angleLines: {
            color: "rgba(255, 255, 255, .3)",
            lineWidth: 1
          },
          gridLines: {
            color: "rgba(255, 255, 255, .3)",
            circular: true
          }
        }
    };
   
    
    return (
        <div>
      <Radar ref={chartRef} data={RadarData} options={RadarOptions} />
      </div>
    );
 
  

};


export default RadarGraph;

