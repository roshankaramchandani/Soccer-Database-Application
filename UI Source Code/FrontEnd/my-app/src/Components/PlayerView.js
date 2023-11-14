import React, { useState, useEffect } from "react";
import { useSearchParams ,useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import Select from 'react-select';
import 'react-svg-radar-chart/build/css/index.css';
import { Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis } from 'recharts';

let goalKeeping=["Diving","Handling","GoalKick","Positioning","Reflexes"];
let defensive=["DefensiveAwareness","StandingTackle","SlidingTackle","Strength","Speed","Aggression","Interception"];
let offensive=["Crossing","Finishing","HeadingAccuracy","Volleys","Dribbling","ShortPass","LongPass","FreeKick","Penalties","LongShots","Jump"];
let offsensiveColumns={Crossing:"Crossing",Finishing:"Finishing",HeadingAccuracy:"HeadingAccuracy",Volleys:"Volleys",Dribbling:"Dribbling",ShortPass:"ShortPass",
                        LongPass:"LongPass",FreeKick:"FreeKick",Penalties:"Penalties",LongShots:"LongShots",Jump:"Jump"};
const PlayerView = props => {

  let navigate = useNavigate();
  const initialPlayerState = {
    playerId: null,
    playerName: "",
    countryName: "",
    clubName: "",
    Diving:null,
    Handling:null,
    GoalKick:null,
    Positioning:null,
    Reflexes:null,
    DefensiveAwareness:null,
    StandingTackle:null,
    SlidingTackle:null,
    Strength:null,
    Speed:null,
    Aggression:null,
    Interception:null,
    Crossing:null,
    Finishing:null,
    HeadingAccuracy:null,
    Volleys:null,
    Dribbling:null,
    ShortPass:null,
    LongPass:null,
    FreeKick:null,
    Penalties:null,
    LongShots:null,
    Jump:null
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPlayer, setCurrentPlayer] = useState(initialPlayerState);
  const [countryList, setCountryList] = useState([]);
  const [offensivedata,setOffensivedata]=useState([0,0,0,0,0,0,0,0,0,0,0])
  const [defensivedata,setDefensivedata]=useState([0,0,0,0,0,0,0])
  const [goalkeepingdata,setGoalkeepingdata]=useState([0,0,0,0,0])
  const [clubList, setClubList] = useState([]);
  const [message, setMessage] = useState("");
  

  const optionSize=[{'value':9 , 'label' : 'A'},{'value':10 , 'label' : 'B'},{'value':11 , 'label' : 'C'},{'value':12 , 'label' : 'D'}]
 
  useEffect(() => {
    retrieveCountries();
  }, []);


  useEffect(() => {
    retrieveClubs();
  }, []);

  useEffect(() => {
      console.log(searchParams.get("playerId"));
    getTutorial(searchParams.get("playerId"));
  }, [searchParams.get("playerId")],offensivedata);



  const getTutorial = id => {
    axios.get(API_ENDPOINT+"getPlayerById", {
         params: { playerId: id } 
    }).then(function (response) {
       console.log(response.data.player);
        //var sad=response.data.player;
        //sad.published=false;
        setCurrentPlayer(response.data.player);
        let offensivesad=[]
        offensive.map((skill) => ( 
            offensivesad.push({name : skill , x: response.data.player[skill]})
          ));
        setOffensivedata(offensivesad);

        let defsad=[]
        defensive.map((skill) => ( 
            defsad.push({name : skill , x: response.data.player[skill]})
          ));
        setDefensivedata(defsad);

        let gksad=[]
        goalKeeping.map((skill) => ( 
            gksad.push({name : skill , x: response.data.player[skill]})
          ));
        setGoalkeepingdata(gksad);
        
    }) .catch((e) => {
        console.log(e);
      });    
  };

  const retrieveCountries = () => {
    //var xdas=[{"clubName": "FC Barcelona","countryName": "Argentina","playerId": 1,"playerName": "L. Messi"},{"clubName": "Juventus","countryName": "Portugal","playerId": 2,"playerName": "Cristiano Ronaldo"}];
    //setPlayers(xdas);
    axios.get(API_ENDPOINT+"getAllCountries", {

    })
    .then(function (response) {
      setCountryList(response.data.countries);
      console.log(response.data.countries);
    }) .catch((e) => {
        console.log(e);
      });        
};


const retrieveClubs = () => {
    //var xdas=[{"clubName": "FC Barcelona","countryName": "Argentina","playerId": 1,"playerName": "L. Messi"},{"clubName": "Juventus","countryName": "Portugal","playerId": 2,"playerName": "Cristiano Ronaldo"}];
    //setPlayers(xdas);
    axios.get(API_ENDPOINT+"getAllClubs", {

    })
    .then(function (response) {
        setClubList(response.data.clubs);
      console.log(response.data.clubs);
    }) .catch((e) => {
        console.log(e);
      });        
};

const handleSelectChange = (s,event) => {
   
    setCurrentPlayer({ ...currentPlayer, [event.name]: s.label });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentPlayer({ ...currentPlayer, [name]: value });
  };

  const handleInputChange2 = (name,val) => {
    
    setCurrentPlayer({ ...currentPlayer, [name]: val });
  };
 
 

  
  const updateTutorial = () => {
    console.log(currentPlayer);
    let formdata=JSON.stringify(currentPlayer);
    let countryId=countryList.filter(option => option.label ==currentPlayer.countryName)[0].value;
    let clubId = clubList.filter(option => option.label ==currentPlayer.clubName)[0].value
    axios.get(API_ENDPOINT+"updatePlayerDetails",{
        params: { data: formdata , clubId : clubId , countryId : countryId } 
   } ).then((response) => {
        console.log(response);
     })
    .catch((error)=>{
        console.log(error);
      
    });
  };


  const goback = () => {
    navigate('/players');  
  };


  return (
    <div>
      <center><h1>View Player</h1></center>
      <form>
      <div>
       
        <label htmlFor="playerName"><strong>Player Name  :  </strong></label>
        {'       '}
        <label> {currentPlayer.playerName}</label>
      </div>
      <br/>    
      <div class="form-group">
      <label for="validationServer01"> <strong> Country  :   </strong></label> 
      {'       '}
      <label>  {
                currentPlayer.countryName
             }</label>
        </div>  

      <br/>       
      <div class="form-group">
      <label for="validationServer01"> <strong> Club  :  </strong> </label> 
      {'       '}
      <label>  {
               currentPlayer.clubName
             }</label>
        
      
        </div>  
        
        <br/>
        <br/>

        <div>
        <h3>Offensive Stats</h3>
        
        <div class="row">
        <div class="col">     
        {offensive.map((skill) => ( 
            <div> <label> <strong>{skill}</strong> </label> {':'} <label>{currentPlayer[skill]}</label> </div>              
            ))}    
        </div>
        <div class="col">
        <RadarChart height={500} width={500} 
            outerRadius="80%" data={offensivedata}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis domain={[0,100]} />
            <Radar dataKey="x" stroke="green" 
                fill="red" fillOpacity={0.5} />
        </RadarChart>
        </div> 
        </div>
        </div>
        <div>
        <h3>Defensive Stats</h3>
        <div class="row">
        <div class="col">
        {defensive.map((skill) => ( 
            <div> <label> <strong>{skill} </strong> </label> {':'} <label>{currentPlayer[skill]}</label> </div>              
            ))}    
        </div>  
        <div class="col">   
         <RadarChart height={500} width={500} 
            outerRadius="80%" data={defensivedata}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis domain={[0,100]} />
            <Radar dataKey="x" stroke="green" 
                fill="green" fillOpacity={0.5} />
        </RadarChart>
         </div> 

        </div>

        </div>
        <div>
          
        <h3>Goal Keeping Stats</h3>
        
        <div class="row">
        <div class="col">
        {goalKeeping.map((skill) => ( 
            <div> <label><strong> {skill} </strong> </label>  { ':' }  <label>{currentPlayer[skill]}</label></div>              
            ))}    
        </div>
          
        {/* <div>
        <RadarGraph value={offensivedata} label={offensive}  />
        </div> */}
        <div class="col">
          <RadarChart height={600} width={600} 
            outerRadius="80%" data={goalkeepingdata}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis  domain={[0,100]}/>
            <Radar dataKey="x" stroke="green" 
                fill="blue" fillOpacity={0.5} />
        </RadarChart>
        </div>
        </div>
        </div>
       
        <div class="text-center">    
     
       <button
            type="submit"
            className="btn btn-warning"
            onClick={goback}
          > Back </button>   
       </div>   
      


      </form>

     
    </div>
  );
};

export default PlayerView;