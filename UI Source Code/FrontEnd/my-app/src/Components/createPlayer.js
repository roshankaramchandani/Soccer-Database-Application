import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../constants";
import Select from 'react-select';
import Slider from "./Slider";
import Popup from 'react-popup';
import '../css/popup.css';

let goalKeeping=["Diving","Handling","GoalKick","Positioning","Reflexes"];
let defensive=["DefensiveAwareness","StandingTackle","SlidingTackle","Strength","Speed","Aggression","Interception"];
let offensive=["Crossing","Finishing","HeadingAccuracy","Volleys","Dribbling","ShortPass","LongPass","FreeKick","Penalties","LongShots","Jump"];

const CreatePlayer = props => {
  const initialPlayerState = {
    playerName: "",
    countryName: "",
    clubName: "",
    Diving:50,
    Handling:50,
    GoalKick:50,
    Positioning:50,
    Reflexes:50,
    DefensiveAwareness:50,
    StandingTackle:50,
    SlidingTackle:50,
    Strength:50,
    Speed:50,
    Aggression:50,
    Interception:50,
    Crossing:50,
    Finishing:50,
    HeadingAccuracy:50,
    Volleys:50,
    Dribbling:50,
    ShortPass:50,
    LongPass:50,
    FreeKick:50,
    Penalties:50,
    LongShots:50,
    Jump:50
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
    axios.get(API_ENDPOINT+"createPlayer",{
        params: { data: formdata , clubId : clubId , countryId : countryId } 
   } ).then((response) => {
        console.log(response);
        Popup.alert("Player has been sucessfully created!!");
     })
    .catch((error)=>{
        console.log(error);
      
    });
    }
    
  };

  return (
    <div>
      <center><h1>Create Player</h1></center>
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
            placeholder="Select Country"
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
            placeholder="Select Club"
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

        <div class="col">
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
          > Create </button>
      </div>    
    </div>
  );
};

export default CreatePlayer;