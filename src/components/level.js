import { LevelInvalidationReason } from './levelInvalidationReason.js';
import { SquareType } from './squareType.js';

export class Level {
  constructor(squares = []) {
    this.assertValidSquares(squares);

    this.squares = squares;
    this.rowCount = squares.length;
    this.columnCount = this.rowCount > 1 ? squares[0].length : 0;

    this.onChanged();
  }

  get playerPosition() {
    for (let row = 0; row < this.rowCount; ++row) {
      for (let column = 0; column < this.columnCount; ++column) {
        if (this.squares[row][column] === SquareType.Player) {
          return { row, column };
        }
      }
    }

    throw new Error('Failed to find start position');
  }

  get boxes() {
    const boxes = [];

    for (let row = 0; row < this.rowCount; ++row) {
      for (let column = 0; column < this.columnCount; ++column) {
        if (this.squares[row][column] === SquareType.Box) {
          boxes.push({ row, column });
        }
      }
    }

    return boxes;
  }

  isAccessible(position) {
    const square = this.getSquare(position);

    return square !== SquareType.Wall && square !== undefined;
  }

  getSquare({ row, column }) {
    return row < this.rowCount ? this.squares[row][column] : undefined;
  }

  insertRowAt(pos) {
    this.squares.splice(
      pos,
      0,
      _.times(this.columnCount, () => SquareType.Empty)
    );

    ++this.rowCount;

    this.onChanged();
  }

  removeRowAt(pos) {
    this.squares.splice(pos, 1);

    --this.rowCount;

    this.onChanged();
  }

  insertColumnAt(pos) {
    for (const row of this.squares) {
      row.splice(pos, 0, SquareType.Empty);
    }

    ++this.columnCount;

    this.onChanged();
  }

  removeColumnAt(pos) {
    for (const row of this.squares) {
      row.splice(pos, 1);
    }

    --this.columnCount;

    this.onChanged();
  }

  changeType({ row, column }, squareType) {
    this.squares[row][column] = squareType;

    this.onChanged();
  }

  // private methods
  onChanged() {
    this.errors = this.validate();
  }

  validate() {
    const errors = {};
    const squareTypeCounts = this.sumSquareTypes(this.squares);

    if (squareTypeCounts[SquareType.Box] === 0) {
      errors[LevelInvalidationReason.NoBoxes] = true;
    }

    if (squareTypeCounts[SquareType.Box] > squareTypeCounts[SquareType.Goal]) {
      errors[LevelInvalidationReason.TooLessGoals] = true;
    }

    if (squareTypeCounts[SquareType.Player] === 0) {
      errors[LevelInvalidationReason.NoPlayer] = true;
    } else if (squareTypeCounts[SquareType.Player] > 1) {
      errors[LevelInvalidationReason.MultiplePlayers] = true;
    }

    return _.isEmpty(errors) ? undefined : errors;
  }

  sumSquareTypes(squares) {
    const result = _.fromPairs(_.map(SquareType, type => [type, 0]));

    for (const row of squares) {
      for (const column of row) {
        if (!(column in result)) {
          throw new Error(`Unknown square type ${column}`);
        }

        ++result[column];
      }
    }

    return result;
  }

  assertValidSquares(squares) {
    const columnCountValid = squares.every((row, index) => {
      return index === 0 || row.length === squares[index - 1].length;
    });

    if (!columnCountValid) {
      const squaresHumanized = JSON.stringify(squares.map(row => row.join(', ')).join('//'));

      throw new Error(`Column count of rows differs (${squaresHumanized})`);
    }
  }
}
