import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import fire from '../Firebase/firebase';
import db from '../Firebase/db';

import GameRoom from './GameRoom';
import GameRoomList from '../Components/GameRooms/GameRoomList';
import CreateGameRoom from './CreateGameRoom';

import updateGameRooms from '../Actions/updateGameRooms';
import updateProblems from '../Actions/updateProblems';

class Home extends Component {
  componentWillMount() {
    let { updateGameRooms, updateProblems } = this.props;
    // grab and listen for game rooms from firebase db
    db.Rooms.on('value', data => {
      const roomsData = data.val();
      const roomKeys = Object.keys(roomsData);
      const rooms = roomKeys.map((roomKey) => {
        const roomData = roomsData[roomKey];
        roomData.key = roomKey;
        return roomData;
      });
      // dispatch action to change game rooms array in store
      updateGameRooms(rooms);
    });

    db.Problems.once('value', data => {
      updateProblems(data.val());  
    });

  }

  render() {
    let { gameRooms, navigate } = this.props;
    return gameRooms ? (
       <div>    
         <h2>Welcome to Hacker Arena</h2>
         <CreateGameRoom />
         <GameRoomList 
           gameRooms={gameRooms}
           navigate={navigate}
         />
       </div>
      ) : null;
  }
}

const mapStateToProps = (state) => {
  console.log('map state to props state passed: ', state);
  return ({
  gameRooms: state.gameRooms
});
};

const mapDispatchToProps = (dispatch) => ({
  updateGameRooms: (rooms) => dispatch(updateGameRooms(rooms)),
  updateProblems: (problems) => dispatch(updateProblems(problems)),
  navigate: (route) => dispatch(push(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);