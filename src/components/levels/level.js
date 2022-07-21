import { LevelInvalidationReason } from './levelInvalidationReason.js';
import { SquareType } from '../squareType.js';

export class Level {
  constructor(name = 'unsaved', { board } = { board: [[SquareType.Empty]] }) {
    this.assertValidBoard(board);

    this.name = name;
    this.board = [...board];
    this.rowCount = board.length;
    this.columnCount = this.rowCount > 0 ? board[0].length : 0;

    this.onChanged();
  }

  get playerPosition() {
    for (let row = 0; row < this.rowCount; ++row) {
      for (let column = 0; column < this.columnCount; ++column) {
        if (this.board[row][column] === SquareType.Player) {
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
        if (this.board[row][column] === SquareType.Box) {
          boxes.push({ row, column });
        }
      }
    }

    return boxes;
  }

  serialize() {
    return `{
  board: [
    ${this.board.map(row => JSON.stringify(row)).join(',\n    ')}
  ]
}`;
  }

  isAccessible(position) {
    const square = this.getSquare(position);

    return square !== SquareType.Wall && square !== undefined;
  }

  getSquare({ row, column }) {
    return row < this.rowCount ? this.board[row][column] : undefined;
  }

  insertRowAt(pos) {
    this.board.splice(
      pos,
      0,
      _.times(this.columnCount, () => SquareType.Empty)
    );

    ++this.rowCount;

    this.onChanged();
  }

  removeRowAt(pos) {
    this.board.splice(pos, 1);

    --this.rowCount;

    this.onChanged();
  }

  insertColumnAt(pos) {
    for (const row of this.board) {
      row.splice(pos, 0, SquareType.Empty);
    }

    ++this.columnCount;

    this.onChanged();
  }

  removeColumnAt(pos) {
    for (const row of this.board) {
      row.splice(pos, 1);
    }

    --this.columnCount;

    this.onChanged();
  }

  changeType({ row, column }, squareType) {
    this.board[row][column] = squareType;

    this.onChanged();
  }

  // private methods
  onChanged() {
    this.errors = this.validate();
  }

  validate() {
    const errors = {};
    const squareTypeCounts = this.sumSquareTypes(this.board);

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

  sumSquareTypes(board) {
    const result = _.fromPairs(_.map(SquareType, type => [type, 0]));

    for (const row of board) {
      for (const column of row) {
        if (!(column in result)) {
          throw new Error(`Unknown square type ${column}`);
        }

        ++result[column];
      }
    }

    return result;
  }

  assertValidBoard(board) {
    const columnCountValid = board.every((row, index) => {
      return index === 0 || row.length === board[index - 1].length;
    });

    if (!columnCountValid) {
      const boardHumanized = JSON.stringify(board.map(row => row.join(', ')).join('//'));

      throw new Error(`Invalid board: Column count of rows differs (${boardHumanized})`);
    }
  }
}
