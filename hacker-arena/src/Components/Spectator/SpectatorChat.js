import React, { Component } from 'react';
import fire from '../../Firebase/firebase';
import Webrtc from '../../Containers/PeerVideos/Webrtc.js';
import SpectatorChatMessage from './SpectatorChatMessage.js';

class SpectatorChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ''
    }
    this.handleMsgInput = this.handleMsgInput.bind(this);
    this.handleMsgSend = this.handleMsgSend.bind(this);
    
  }

  handleMsgInput(e) {
    this.setState({ msg: e.target.value });
  }

  handleMsgSend(e) {
    e.preventDefault();
    // prevent empty messages
    if (!this.state.msg.length) return;
    let msg = this.state.msg;
    let room = this.props.gameRoom;
    let username = fire.auth().currentUser.email.split('@')[0] || 'UnkownUser';
    this.props.sendSpectatorMessage(room, username, msg);
    this.setState({ msg: '' });
  }

  render() {
    let { gameRoom } = this.props;
    let spectatorChat = gameRoom.spectatorChat || [];
    let { spectators } = gameRoom;
    return (
      <div style={{ margin: "5%" }}>
       <Webrtc
        room={gameRoom}
       />
        <form onSubmit={this.handleMsgSend}>
          <h2>Chat: </h2>
            <p>{(spectators ? spectators.filter((spectatorName, i) => spectators.indexOf(spectatorName) === i).join(', ') : '')}</p>
          <input type="text" onChange={this.handleMsgInput} value={ this.state.msg }/>
          <button className='gamePreviewButton'>
            <h3>Send</h3>
          </button>
        </form>
        
        <div>
        
          { spectatorChat.map((chatMessage, i) => (
            <SpectatorChatMessage 
              key={chatMessage.msg+i}
              chatMessage={chatMessage}
            /> 
          )).reverse()}
        </div>
      </div>
    );
  }
}

export default SpectatorChat;