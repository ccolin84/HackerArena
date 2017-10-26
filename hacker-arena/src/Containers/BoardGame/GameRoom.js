import React from 'react';
import { connect } from 'react-redux';
import fire from '../../Firebase/firebase';
import { push } from 'react-router-redux';
import Board from './Board';
import Dice from './Dice';
import MovePlayer from './MovePlayer';
import CodeEditor from './CodePage/CodeEditor';
import TestSuite from './CodePage/TestSuite';
import Attack from './Attack';
//dice reroll cheat
//codeeditor/
//dice roll resets;
//update points
class GameRoom extends React.Component {
  constructor (props) {
    super (props);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount () {
    this.handleEnter();
  }

  componentWillUpdate () {
    this.handleEnter();
  }
  
  componentWillUnmount () {
    this.handleLeave();
  }
  
  handleEnter () {
    let {room, user, navigate} = this.props;
    if (room) {
      window.addEventListener('beforeunload', this.handleLeave);
      let notFull = room.players.length < 4 && !room.gameStarted; //game not started;
      let notAlreadyIn = room.players.indexOf(user) === -1;
      let wasIn = Object.keys(room.playerInfo).indexOf(user) !== -1;
      let firstTile = room.board[0][0][0];
      if (notFull && notAlreadyIn) {//not full nor started and not in;
        room.players.push(user);
        firstTile.push(user);
        if (!room.playerInfo[user]) {
          room.playerInfo[user] = {
            position: [0,0],
            diceResult: 0,
            canMove: true,
            disruptions: [''],
            liveInput: '',
            events: '',
            credits: 5,
            testStatus: []
          }
        }
        fire.database().ref('BoardRooms/' + room.key).set(room);
      } else if (!notFull && wasIn && notAlreadyIn) { //refresh coming back
        room.players.push(user);
        fire.database().ref('BoardRooms/' + room.key).set(room);
      } else if (!notFull && notAlreadyIn) {
        navigate('/CodeRunLobby');
      }
    }
  }

  handleLeave () {
    if (this.props.room !== undefined) {
      let user = this.props.user;
      let room = this.props.room;
      room.players = room.players.filter(player => player !== user);
      console.log('room after filter ', room);
      
      if (room.players.length > 0) {
        fire.database().ref('BoardRooms/' + room.key).set(room);
      } else if (room.players.length === 0) {
        fire.database().ref('BoardRooms/' + room.key).remove();
      }
    }
  }

  startGame (e) {
    e.preventDefault();
    let room = this.props.room;
    room.gameStarted = true;
    fire.database().ref('BoardRooms/' + e.target.value).set(room);
  }

  render () {
    let user = this.props.user;
    let room = this.props.room;
    console.log('render room', room);
    if (room === undefined) {
      return <div>
        <div> Please wait as we prepare your board </div>
      </div>
    } else {
      let players = room.players;
      let playerInfo = room.playerInfo;
      players.forEach(player => {
        if (playerInfo[player].position[0] === 6 && playerInfo[player].position[1] === 6) {
          window.swal(`${player} won!`);
        }
      })
      let userInfo = room.playerInfo[user];
      let message, startButton, board, dice, diceResult, canMove, move, codePage, attack;
      if (room.gameStarted && userInfo) {
        startButton = null;
        message = 'Run run run your code hastily down the board';
        console.log('new board ', room.board);
        board = <Board board={room.board}/>;
        diceResult = <div className='dice'>{'Moves Left: ' + room.playerInfo[user].diceResult}</div>;
        if (userInfo.canMove) {
          canMove = <div className='playerTurn'>{`You can move`}</div>;
          dice = <Dice room={room} user={user}/>;
        } else {
          codePage = <div>
            <CodeEditor room={room} user={user}/>
            <TestSuite room={room} user={user}/>
          </div>;
          canMove = <div className='playerTurn'>{`Do toy problem to continue`}</div>
        }
        if (userInfo.diceResult > 0) {
          move = <MovePlayer room={room} user={user}/>;
        }
        if (userInfo.attack) {
          attack = <Attack attack={userInfo.attack} room={room} user={user}/>;
        }
      } else {
        startButton = <button value={this.props.room.key} onClick={this.startGame}>Start Game</button>;
        message = `Waiting for victims`;
        board = null;
        dice = null;
        diceResult = null;
        canMove = null;
        move = null;
      }
      

      return <div>
        <div>{message}</div>
        <div>{this.props.room.players.join(' ')}</div>
        {startButton}
        {board}
        {canMove}
        <div className='diceContainer'>
          {diceResult}
          {dice}
        </div>
        {move}
        {attack}
        <div id="editorAndTestSuite">
          {codePage}
        </div>
        <div className='bottomend'></div>
      </div>
    }
  }
}

const mapStoP = (state) => {
  return {
    user: fire.auth().currentUser.email.split('@')[0],
    room: state.boardRooms ? state.boardRooms[state.router.location.pathname.split('/')[2]] : undefined
  }
}

const mapDtoP = (dispatch) => {
  return {
    navigate: (route) => dispatch(push(route))
  }
}

export default connect(mapStoP,mapDtoP)(GameRoom);
