import React, { useState, useEffect } from "react";
import { useSearchParams ,useNavigate} from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import Select from 'react-select';
import Slider from "./Slider";
import Popup from 'react-popup';
import '../css/popup.css';
let goalKeeping=["Diving","Handling","GoalKick","Positioning","Reflexes"];
let defensive=["DefensiveAwareness","StandingTackle","SlidingTackle","Strength","Speed","Aggression","Interception"];
let offensive=["Crossing","Finishing","HeadingAccuracy","Volleys","Dribbling","ShortPass","LongPass","FreeKick","Penalties","LongShots","Jump"];

const PlayerEdit = props => {
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
  }, [searchParams.get("playerId")]);



  const getTutorial = id => {
    axios.get(API_ENDPOINT+"getPlayerById", {
         params: { playerId: id } 
    }).then(function (response) {
       console.log(response.data.player);
        //var sad=response.data.player;
        //sad.published=false;
        setCurrentPlayer(response.data.player);
        
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
    if(currentPlayer.playerName==""||currentPlayer.playerName==null||currentPlayer.countryName==""||currentPlayer.countryName==null||currentPlayer.clubName==""||currentPlayer.clubName==null){
      Popup.alert("Please populate the values for name, country and club.");
  }else{

    let formdata=JSON.stringify(currentPlayer);
    let countryId=countryList.filter(option => option.label ==currentPlayer.countryName)[0].value;
    let clubId = clubList.filter(option => option.label ==currentPlayer.clubName)[0].value
    axios.get(API_ENDPOINT+"updatePlayerDetails",{
        params: { data: formdata , clubId : clubId , countryId : countryId } 
   } ).then((response) => {
        console.log(response);
        Popup.alert("The Player record has bee updated !!")
     })
    .catch((error)=>{
        console.log(error);
      
    });
  }
  };

  const goback = () => {
    navigate('/players');  
  };


  return (
    <div>
     <center> <h1>Edit Player</h1> </center>
      <form>
      <div class="form-group">
       
        <label htmlFor="playerName">Player Name</label>
              <input
                type="text"
                className="form-control"
                id="playerName"
                name="playerName"
                value={currentPlayer.playerName}
                onChange={handleInputChange}
              />
      </div>    
      <div class="form-group">
      <label for="validationServer01">Country</label> 
        <Select 
             value = {
                countryList.filter(option => 
                   option.label === currentPlayer.countryName)
             }
            options={countryList}
            className="mb-3"
            placeholder="DS"
            id="countryName"
            name="countryName"
            isSearchable
            onChange={handleSelectChange}
        />
        </div>  

      <div class="form-group">
      <label for="validationServer01">Club</label> 
        <Select 
             value = {
                clubList.filter(option => 
                   option.label === currentPlayer.clubName)
             }
            options={clubList}
            className="mb-3"
            placeholder="DS"
            id="clubName"
            name="clubName"
            onChange={handleSelectChange}
            isSearchable
        />
        </div>  
        <Popup />
        <div class="row">     
        <div class="col">
        <h3>Offensive Stats</h3>
        {offensive.map((skill) => ( 
            <div> <label> {skill} </label> <Slider value={currentPlayer[skill]} increasedssd={handleInputChange2} id={skill} name={skill} /> </div>              
            ))}    
        </div>

        <div class="col ">
        <h3>Defensive Stats</h3>
        {defensive.map((skill) => ( 
            <div> <label> {skill} </label> <Slider value={currentPlayer[skill]} increasedssd={handleInputChange2} id={skill} name={skill} /> </div>              
            ))}    
        </div>     

        <div class="col"> 
        <h3>Goal Keeping Stats</h3>
        {goalKeeping.map((skill) => ( 
            <div> <label> {skill} </label> <Slider value={currentPlayer[skill]} increasedssd={handleInputChange2} id={skill} name={skill} /> </div>              
            ))}    
        </div>

        </div>  

      </form>
      <div class="text-center">    
      <button
            type="submit"
            className="btn btn-primary"
            onClick={updateTutorial}
          > Update </button>
      {'              '}
      {'              '}      

       <button
            type="submit"
            className="btn btn-warning"
            onClick={goback}
          > Back </button>   
       </div>   
    </div>
  );
};

export default PlayerEdit;