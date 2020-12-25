import React, { Component } from 'react';
import Food from '../../../Components/Food/Food';
import Snake from '../../../Components/Snake/Snake';
import isPointsInBound from '../../../Utils/usePointsInBoundedRect';

function getNewPosition(x1: number, y1: number, x2: number, y2: number) {
  const x = Math.floor(Math.random() * (x2 - x1 + 1) + x1);
  const y = Math.floor(Math.random() * (y2 - y1 + 1) + y1);

  return { x, y };
}

interface IProps {}

interface ICoordinates {
  x: number;
  y: number;
}

interface IState {
  foodPosition: ICoordinates;
  snakeStatus: boolean;
  scoreDiff: number;
  score: number;
}

export default class Board extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      foodPosition: {
        x: 100,
        y: 100,
      },
      snakeStatus: true,
      scoreDiff: 5,
      score: 0,
    };
    this.handleSnakeHitFood = this.handleSnakeHitFood.bind(this);
    this.handleHitBoundary = this.handleHitBoundary.bind(this);
    this.handleScore = this.handleScore.bind(this);
    this.handleSnakeHitItself = this.handleSnakeHitItself.bind(this);
  }

  handleScore(diff: number) {
    const boardRef = document.getElementById('board');
    if (boardRef) {
      const { x, y, width, height } = boardRef.getBoundingClientRect();
      const position = getNewPosition(
        x + 10,
        y + 10,
        width + x - 30,
        height + y - 30,
      );
      this.setState((prevState) => ({
        ...prevState,
        foodPosition: position,
        score: prevState.score + diff,
      }));
    }
  }

  handleSnakeHitFood(
    snakeX: number,
    snakeY: number,
    fn?: Function,
    cb2?: Function,
  ) {
    // snakeX and snakeY are current position of snake head
    if (snakeX && snakeY && this.state) {
      const { foodPosition } = this.state;
      const isSnakeAteFood = isPointsInBound(
        { x: snakeX, y: snakeY },
        {
          x1: foodPosition.x - 15,
          y1: foodPosition.y - 15,
          x2: foodPosition.x + 15,
          y2: foodPosition.y + 15,
        },
      );
      if (isSnakeAteFood) {
        this.handleScore(5);
        if (fn) {
          fn();
        }
        if (cb2) {
          cb2();
        }
      }
    }
  }

  handleSnakeHitItself(status: boolean) {
    this.setState((prevState) => ({
      ...prevState,
      snakeStatus: !status,
    }));
  }

  handleHitBoundary(snakeX: number, snakeY: number) {
    // snakeX and snakeY are current position of snake head
    const boardRef = document.getElementById('board');
    if (boardRef) {
      const { x, y, width, height } = boardRef?.getBoundingClientRect();
      const isSnakeHitBoundary = isPointsInBound(
        { x: snakeX, y: snakeY },
        { x1: x + 10, y1: y + 10, x2: x - 35 + width, y2: y - 35 + height },
      );
      if (!isSnakeHitBoundary) {
        this.setState((prevState) => ({
          ...prevState,
          snakeStatus: false,
        }));
      }
    }
  }

  render() {
    const { foodPosition, snakeStatus, score } = this.state;
    return (
      <div className="h-screen w-screen box-border overflow-hidden">
        <div
          className="h-full w-4/5 inline-block box-border border-8 border-flaxShade"
          id="board"
        >
          <Snake
            handleSnakeHitFood={this.handleSnakeHitFood}
            handleHitBoundary={this.handleHitBoundary}
            handleSnakeHitItself={this.handleSnakeHitItself}
            startSnake={snakeStatus}
          />
          <Food x={foodPosition.x} y={foodPosition.y} />
        </div>
        <div className="h-full w-1/5 inline-block box-border overflow-hidden">
          {score}
        </div>
      </div>
    );
  }
}
