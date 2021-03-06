import React, { Component } from 'react';

class WaitingForPlayer extends Component { 
  render() {
    let playerSpans = [];
    if (this.props.room) {
      let { room, teams } = this.props;
      let { playerCapacity } = room;
      let players = room.players || {};
      let playerNames = Object.keys(players);

      if (room.isPairRoom) {
        for (let i = 0; i < room.maxPairs; i++) {
          playerSpans.push(
            <li className='list-group-item' key={'team' + i}>
              <h4>
                Team {i} -> {
                  <div>
                    <div>
                      Driver: {
                        teams[i] && teams[i].driver ? 
                          teams[i].driver
                          : 
                          <span style={{color: 'darkgreen'}}>
                            OPEN
                          </span>
                      }
                    </div>
                    <div>
                      Navigator: {
                        teams[i] && teams[i].navigator ? 
                          teams[i].navigator 
                          :
                          <span style={{color: 'darkgreen'}}>
                          OPEN
                          </span>                  
                      }
                    </div>
                  </div>
                }
              </h4>
            </li>
          );
        }
      } else {
        for (let i = 0; i < playerCapacity; i++) {
          playerSpans.push(
            <li className='list-group-item' key={(playerNames[i] || "OPEN") + i}>
              <h4>
                Player {i} -> { playerNames[i] ? playerNames[i] : <span style={{color: 'darkgreen'}}>OPEN</span> }
              </h4>
            </li>
          );
        }
      }
    }

    return (
      <div>
        <h3>Waiting For Players</h3>
        <ul style={{ margin: '10%', marginBottom: '5%', marginTop: '5%'}}>
          { this.props.room ? playerSpans : null}
        </ul>
        <i className="fa fa-circle-o-notch fa-spin" style={{fontSize: "300px", color: 'grey'}}></i>
      </div>
    );
  }
}

export default WaitingForPlayer;