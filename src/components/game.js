import { SquareType } from './squareType.js';

export class JoKiBanGame {
  constructor(level) {
    if (level.errors) {
      throw new Error(`Failed to create game because level has errors: ${level.errors.join('\n')}`);
    }

    this.level = level;
    this.playerPosition = this.level.playerPosition;
    this.boxes = this.level.boxes.map((position, index) => {
      return { id: index, position, solved: false };
    });
  }

  go(step) {
    const { destination, boxAtDestination } = this.getDestination(this.playerPosition, step);

    if (!destination) {
      // player stands next to a wall
      return;
    }

    if (boxAtDestination) {
      const { destination: boxDestination, boxAtDestination: blockingBox } = this.getDestination(destination, step);

      if (!boxDestination || blockingBox) {
        // box stands next to a barrier
        return;
      }

      boxAtDestination.position = boxDestination;
      boxAtDestination.solved = this.level.getSquare(boxDestination) === SquareType.Goal;
    }

    this.playerPosition = destination;

    return {
      player: destination,
      box: boxAtDestination,
    };
  }

  getBox({ row, column }) {
    return this.boxes.find(({ position }) => position.row === row && position.column === column);
  }

  getDestination(origin, { rowDelta, columnDelta }) {
    const destination = {
      row: origin.row + rowDelta,
      column: origin.column + columnDelta,
    };

    if (!this.level.isAccessible(destination)) {
      return {};
    }

    const boxAtDestination = this.getBox(destination);

    return {
      destination,
      boxAtDestination,
    };
  }
}
