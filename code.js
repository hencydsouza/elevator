class Elevator {
    constructor(id) {
        this.id = id;
        this.currentFloor = 0;
        this.direction = 'idle';
        this.status = 'idle';
        this.upList = [];
        this.downList = [];
    }

    addRequest(floor, direction) {
        if (this.direction === 'idle') {
            if (this.currentFloor <= floor) {
                this.upList.push(floor)
                this.upList.sort((a, b) => a - b)
            } else {
                this.downList.push(floor);
                this.downList.sort((a, b) => b - a)
            }
        } else if (direction === 'up') {
            this.upList.push(floor);
            this.upList.sort((a, b) => a - b)
        } else if (direction == 'down') {
            this.downList.push(floor);
            this.downList.sort((a, b) => b - a)
        }
    }

    updateStatus() {
        if (this.upList.length === 0 && this.downList.length === 0) {
            this.status = 'idle';
            this.direction = 'idle';
        } else if (this.direction === 'idle' && this.status === 'idle') {
            if (this.upList.length > 0) {
                this.direction = 'up';
                this.status = 'moving';
            } else if (this.downList.length > 0) {
                this.direction = 'down';
                this.status = 'moving';
            }
        }
    }

    move() {
        this.updateStatus()
        if (this.status === 'moving') {
            if (this.direction === 'up') {
                const nextFloor = this.upList[0];
                if (this.currentFloor < nextFloor) {
                    this.currentFloor++;
                }

                if (this.currentFloor === nextFloor) {
                    this.upList.shift()
                }

                if (this.upList.length === 0) {
                    this.direction = 'down';
                }
            } else if (this.direction === 'down') {
                const nextFloor = this.downList[0];
                if (this.currentFloor > nextFloor) {
                    this.currentFloor--;
                }

                if (this.currentFloor === nextFloor) {
                    this.downList.shift()
                }

                if (this.downList.length === 0) {
                    this.direction = 'up';
                }
            }
        }
        this.updateStatus()

    }
}

class ElevatorSystem {
    constructor() {
        this.elevators = [new Elevator(1), new Elevator(2)];
    }

    findBestElevator(requestedFloor, direction) {
        let bestElevator = null;
        let minDistance = Infinity;

        for (let elevator of this.elevators) {
            let distance = Math.abs(elevator.currentFloor - requestedFloor);

            if (elevator.status === 'idle') {
                if (distance <= minDistance) {
                    minDistance = distance;
                    bestElevator = elevator;
                }
            } else if (elevator.direction === direction) {
                if (elevator.direction === 'up' && requestedFloor >= elevator.currentFloor) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestElevator = elevator;
                    }
                } else if (elevator.direction === 'down' && requestedFloor <= elevator.currentFloor) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestElevator = elevator;
                    }
                }
            }
        }

        if (!bestElevator) {
            for (let elevator of this.elevators) {
                let distance = Math.abs(elevator.currentFloor - requestedFloor);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestElevator = elevator;
                }
            }
        }

        return bestElevator;
    }

    requestElevator(requestedFloor, direction) {
        let bestElevator = this.findBestElevator(requestedFloor, direction);
        if (bestElevator) {
            bestElevator.addRequest(requestedFloor, direction);
        }
    }

    makeInternalRequest(id, requestedFloor) {
        let elevator = this.elevators[id]

        if ((elevator.currentFloor - requestedFloor) > 0) {
            elevator.addRequest(requestedFloor, 'down')
        } else {
            elevator.addRequest(requestedFloor, 'up')
        }
    }

    step() {
        this.elevators.forEach(elevator => elevator.move());
    }
}

let system = new ElevatorSystem();

setTimeout(() => {
    system.requestElevator(5, 'up');
}, 1000)
setTimeout(() => {
    system.makeInternalRequest(0, 4);
}, 5000)
setTimeout(() => {
    system.requestElevator(2, 'down');
}, 2000)
setTimeout(() => {
    system.requestElevator(1, 'down');
}, 3000)
setTimeout(() => {
    system.requestElevator(3, 'down');
}, 4000)

function display() {
    console.log(`Elevator 1, currentFloor: ${system.elevators[0].currentFloor}, direction: ${system.elevators[0].direction},\t upList: [${system.elevators[0].upList}],\t downList: [${system.elevators[0].downList}]`);
    console.log(`Elevator 2, currentFloor: ${system.elevators[1].currentFloor}, direction: ${system.elevators[1].direction},\t upList: [${system.elevators[1].upList}],\t downList: [${system.elevators[1].downList}]`);
    console.log('---------------------');
}

display()
setInterval(() => {
    system.step();
    display()
}, 1000);