/*
  Mars Rover
  
  Build an API to navigate a rover along a topographical grid representation of Mars.
  
  Requirements
  
  - The rover when initialized will have an initial starting point (x, y) as well as a direction (N, S, E, W) that it is facing.
  - The rover should recieve its commands as a string array. It should then iterate over the array executing the commands in sequence until either a) all commands have succeeded in which case return a OK status along with location and direction or b) a command failed due to an obstacle in which case return an OBSTACLE status code along with last successful location and direction
  - If the rover recieves invalid commands immediatly an INVALID_COMMAND status along with location and direction of the last successful command
  - The rover may move forward/backward with the (F, B) commands
  - The rover may turn left and right with the (L, R) commands
  - If the rover encounters obstacles in the terrain then it should return its last successfull location as well as a OBSTACLE status
  - If the rover encounters the edge of the world it should stop and return its last successfull location as well as a OBSTACLE status
  
  Instructions
  
  - ES2015 is supported feel free to use it or use ES5
  - Feel free to modify any code you wish to suit your preference. Also, don't feel limited to methods provided feel free add more (encouraged)
  - If you modify Exersize code (i.e use funtional instead of class based Rover) you'll need to modify the tests accordingly
  - Read the tests! They have helpful in better understanding the requirements
  
  Extra Credit
  
  - add a moveTo() method that takes the (x,y) coordinates to move the rover along the most optimal path bypassing obstacles
  - https://en.wikipedia.org/wiki/A*_search_algorithm
  - https://en.wikipedia.org/wiki/Dijkstra's_algorithm
*/
const chai = require('chai');
const TERRAIN_TYPES = {
	'P': {
  	obstacle: false,
    description: 'plains'
  },
  'M': {
  	obstacle: true,
    description: 'mountains'
  },
  'C': {
  	obstacle: true,
    description: 'crevasse'
  }
};

const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];

// top left corner is (X:0, Y:0)
// bottom right is (X:4, Y:4)
const WORLD = [
	['P', 'P', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'P', 'P'],
	['P', 'M', 'P', 'P', 'P']
];

const DIRECTIONS = ['N', 'S', 'E', 'W'];
const COMMANDS = ['L', 'R', 'F', 'B'];

class Rover {  
	constructor(location, direction) {
        this.location = location;
        this.direction = direction;
        this.status = 'OK';
    }
    command(commands) {
      this.commands = commands;
        for (var i = 0; i < commands.length; i++) {
            switch (commands[i]) {
                case 'L':
                this.changeDirectionLeft();
                break;
                case 'R':
                this.changeDirectionRight();
                break;
                case 'F':
                if (!this.moveForward()) {
                  return {
                    status: 'OBSTACLE',
                    loc: this.location,
                    dir: this.direction
                  };
                }
                break;
                case 'B':
                if (!this.moveBackward()) {
                  return {
                    status: 'OBSTACLE',
                    loc: this.location,
                    dir: this.direction
                  };
                }
                break;
                default:
                return {
                  status: 'INVALID_COMMAND',
                  loc: this.location,
                  dir: this.direction
                };
            }
        }
        return {
          status: this.status,
          loc: this.location,
          dir: this.direction
        };
    }
    changeDirectionLeft() {
        switch (this.direction) {
            case 'N':
              this.direction = 'W';
              break;
            case 'S':
              this.direction = 'E';
              break;
            case 'E':
              this.direction = 'S';
              break;
            case 'W':
              this.direction = 'N';
              break;
        }
    }
    changeDirectionRight() {
        switch (this.direction) {
            case 'N':
            this.direction = 'E';
            break;
            case 'S':
            this.direction = 'W';
            break;
            case 'E':
            this.direction = 'S';
            break;
            case 'W':
            this.direction = 'N';
            break;
        }
    }
    moveForward() {
        switch (this.direction) {
            case 'N':
            if (this.location[1] === 0) {
              return false;
            } else if (WORLD[this.location[1] - 1][this.location[0]] !== 'P') {
              return false; 
            } else {
              this.location[1] = this.location[1] - 1;
            }
            break;
            case 'S':
            if (this.location[1] === 4) {
              return false;
            } else if (WORLD[this.location[1] + 1][this.location[0]] !== 'P') {
              return false;
            } else {
              this.location[1] = this.location[1] + 1;
            }
            break;
            case 'E':
            if (this.location[0] === 4) {
              return false;
            } else if (WORLD[this.location[1]][this.location[0] + 1] !== 'P') {
              return false; 
            } else {
              this.location[0] = this.location[0] + 1;
            }
            break;
            case 'W':
            if (this.location[0] === 0) {
              return false;
            } else if (WORLD[this.location[1]][this.location[0] - 1] !== 'P') {
              return false;
            } else {
              this.location[0] = this.location[0] - 1;
            }
            break;
        }
        return true;
    }
    moveBackward() {
      switch (this.direction) {
          case 'N':
          if (this.location[1] === 4) {
            return false;
          } else if (WORLD[this.location[1] + 1][this.location[0]] !== 'P') {
            return false; 
          } else {
            this.location[1] = this.location[1] + 1;
          }
          break;
          case 'S':
          if (this.location[1] === 0) {
            return false;
          } else if (WORLD[this.location[1] - 1][this.location[0]] !== 'P') {
            return false;
          } else {
            this.location[1] = this.location[1] - 1;
          }
          break;
          case 'E':
          if (this.location[0] === 0) {
            return false;
          } else if (WORLD[this.location[1]][this.location[0] - 1] !== 'P') {
            return false;
          } else {
            this.location[0] = this.location[0] - 1;
          }
          break;
          case 'W':
          if (this.location[0] === 4) {
            return false;
          } else if (WORLD[this.location[1]][this.location[0] + 1] !== 'P') {
            return false;
          } else {
            this.location[0] = this.location[0] + 1;
          }
          break;
      }
      return true;
    }
    moveTo(startPosition, endPosition) {
      const startNode = {
        pos: startPosition,
        g: 0,
        f: 0
      };
      const endNode = {
        pos: endPosition,
        g: 0,
        f: 0
      };
      let shortestPath = this.shortestPath(startNode, endNode);

      if (shortestPath.length === 0) {
        return "No path found";
      } else {
        let ret = [];
        for (let i = 0; i < shortestPath.length; i++) {
          ret.push(shortestPath[i].pos);
        }
        console.log(ret);

        return ret;
      }
      
    }
    shortestPath(start, end) {
      var unvisitedList   = [];
      var visitedList = [];
      unvisitedList.push(start);
   
      while(unvisitedList.length > 0) {
        var lowInd = 0;
        for(var i=0; i<unvisitedList.length; i++) {
          if(unvisitedList[i].f < unvisitedList[lowInd].f) { lowInd = i; }
        }
        var currentNode = unvisitedList[lowInd];
        if(currentNode.pos[0] == end.pos[0] && currentNode.pos[1] == end.pos[1]) {
          var curr = currentNode;
          var ret = [];
          while(curr.parent) {
            ret.push(curr);
            curr = curr.parent;
          }
          return ret.reverse();
        }

        unvisitedList.splice(currentNode, 1);
        visitedList.push(currentNode);
        var neighbors = this.neighbors(currentNode);
        for(var i=0; i<neighbors.length;i++) {
          var neighbor = neighbors[i];
          if(visitedList.find(closed => {
            return (closed.pos[0] === neighbor.pos[0] && closed.pos[1] === neighbor.pos[1])
          })) {
            continue;
          }

          var score = currentNode.score + 1;
          var scoreIsBest = false;
          if(!unvisitedList.find(obj => {
            return (obj.pos[0] === neighbor.pos[0] && obj.pos[1] === neighbor.pos[1])
          })) {
            scoreIsBest = true;
            unvisitedList.push(neighbor);
          }
          else if(score < neighbor.score) {
            scoreIsBest = true;
          }
   
          if(scoreIsBest) {
            neighbor.parent = currentNode;
            neighbor.score = score;
          }
        }
      }

      return [];
    }

    neighbors(node) {
      var neighbors = [];
      var x = node.pos[1];
      var y = node.pos[0];
      var neighbor = {};
   
      if(WORLD[x - 1] && WORLD[x - 1][y] == 'P') {
        neighbor.pos = [y, x - 1];
        neighbor.score = 0;
        neighbors.push(neighbor);
      }
      neighbor = {};
      if(WORLD[x + 1] && WORLD[x + 1][y] == 'P') {
        neighbor.pos = [y, x + 1];
        neighbor.score = 0;
        neighbors.push(neighbor);
      }
      neighbor = {};
      if(WORLD[x][y - 1] && WORLD[x][y - 1] == 'P') {
        neighbor.pos = [y - 1, x];
        neighbor.score = 0;
        neighbors.push(neighbor);
      }
      neighbor = {};
      if(WORLD[x][y + 1] && WORLD[x][y + 1] == 'P') {
        neighbor.pos = [y + 1, x];
        neighbor.score = 0;
        neighbors.push(neighbor);
      }
      return neighbors;
    }
    
}

var expect = chai.expect;

describe('Mars Rover', function() {
  let rover1 = null;
  beforeEach(function() {
    rover1 = new Rover([2,2], 'N');
  });
	describe('When the Mars Rover is initialized', function() {
  	it('should set the starting location', function() {
      expect(rover1.location).to.deep.equal([2,2]);
    });
    it('should set the starting direction', function() {
    	expect(rover1.direction).to.equal('N');
    });
  });
  describe('When the rover recieves commands', function() {
  	it('should store the commands', function() {
      rover1.command(['F', 'F', 'B']);
      expect(rover1.commands).to.deep.equal(['F', 'F', 'B']);
    });
    it('should handle invalid commands', function() {
    	const status = rover1.command(['X']);
      
      expect(status).to.deep.equal({
      	status: 'INVALID_COMMAND',
        loc: [2,2],
        dir: 'N'
      });
    });
  });
  describe('When the rover executes valid commands', function() {
  	describe('When facing north', function() {
    	describe('When moving forward', function() {
      	it('should move north one tile', function() {
          const status = rover1.command(['F']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,1],
            dir: 'N'
          });
        });
      });
      describe('When moving backward', function() {
      	it('should move south one tile', function() {
          const status = rover1.command(['B']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,3],
            dir: 'N'
          });
        });
      });
      describe('When turning left', function() {
      	it('should be facing west', function() {
          const status = rover1.command(['L']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'W'
          });
        });
      });
      describe('When turning right', function() {
      	it('should be facing east', function() {
          const status = rover1.command(['R']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'E'
          });
        });
      });
    });
  });
  describe('When the rover encounters obstacles', function() {
  	describe('When encountering a mountain', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['L', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,2],
          dir: 'W'
        });
      });
    });
    describe('When encountering a crevasse', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['F', 'F', 'R', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'E'
        });
      });
    })
    describe('When encountering the edge of the world', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['F', 'F', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'N'
        });
      });
    });
  });
  describe('When finding shortest path', function() {
  	it('should return shortest path', function() {
      const path = rover1.moveTo([2,2],[0,0]);
      expect(path).to.deep.equal([[2,1],[2,0],[1,0],[0,0]]);
    });
    it('should return shortest path', function() {
      const path = rover1.moveTo([2,2],[4,0]);
      expect(path).to.deep.equal([[2,3],[3,3],[4,3],[4,2],[4,1],[4,0]]);
    });
    it('should return shortest path', function() {
      const path = rover1.moveTo([0,0],[4,4]);
      expect(path).to.deep.equal([[1,0],[2,0],[2,1],[2,2],[2,3],[2,4],[3,4],[4,4]]);
    });
    it('should NOT find a path', function() {
      const path = rover1.moveTo([2,2],[1,1]);
      expect(path).to.deep.equal("No path found");
    });
  });
});

//mocha.run();