'use client';

import * as React from 'react';
import {
  Play,
  RotateCcw,
  Clock,
  MousePointer,
  Target,
} from 'lucide-react';
import { SlidingNumber } from '@/components/animate-ui/text/sliding-number';
import { motion, AnimatePresence } from 'motion/react';

// 游戏配置
const GRID_SIZE = 4; // 4x4 网格
const TOTAL_PAIRS = (GRID_SIZE * GRID_SIZE) / 2;

// 卡片图标数据 - 使用emoji
const CARD_ICONS = [
  '🎯', '🎨', '🎪', '🎭', '🎪', '🎨', '🎯', '🎭',
  '🎮', '🎸', '🎺', '🎹', '🎮', '🎸', '🎺', '🎹'
];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  isError?: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: number[];
  matches: number;
  moves: number;
  timeElapsed: number;
  isGameStarted: boolean;
  isGameCompleted: boolean;
  errorCards: number[];
}

// 控制面板组件
function GameControlPanel({
  timeElapsed,
  moves,
  matches,
  isGameStarted,
  onStart,
  onRestart,
}: {
  timeElapsed: number;
  moves: number;
  matches: number;
  isGameStarted: boolean;
  onStart: () => void;
  onRestart: () => void;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full items-center rounded-xl border border-gray-200/60 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm p-4 shadow-sm mb-8">
      {/* 计时器 */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
          <Clock size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-sm min-w-0">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">时间</div>
          <div className="text-gray-900 dark:text-gray-100 font-mono font-semibold">
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      {/* 步数 */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/50">
          <MousePointer size={16} className="text-green-600 dark:text-green-400" />
        </div>
        <div className="text-sm min-w-0">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">步数</div>
          <div className="text-gray-900 dark:text-gray-100 font-mono font-semibold">
            <SlidingNumber number={moves} padStart />
          </div>
        </div>
      </div>

      {/* 匹配进度 */}
      <div className="flex items-center space-x-3 flex-1">
        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50">
          <Target size={16} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div className="text-sm min-w-0">
          <div className="text-gray-500 dark:text-gray-400 text-xs font-medium mb-0.5">进度</div>
          <div className="text-gray-900 dark:text-gray-100 font-semibold flex items-center">
            <SlidingNumber number={matches} />
            <span className="text-gray-400 dark:text-gray-500"> / {TOTAL_PAIRS}</span>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />

      {/* 开始/重新开始按钮 */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        onClick={isGameStarted ? onRestart : onStart}
        className="flex items-center space-x-2 rounded-lg bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm"
      >
        {isGameStarted ? (
          <>
            <RotateCcw size={14} />
            <span>重新开始</span>
          </>
        ) : (
          <>
            <Play size={14} />
            <span>开始游戏</span>
          </>
        )}
      </motion.button>
    </div>
  );
}

// 游戏卡片组件
function GameCard({
  card,
  index,
  onClick,
  disabled,
}: {
  card: Card;
  index: number;
  onClick: (index: number) => void;
  disabled: boolean;
}) {
  const getCardStyle = () => {
    if (card.isError) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-400 shadow-red-100 dark:shadow-red-900/20';
    }
    if (card.isMatched) {
      return 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-400 shadow-green-100 dark:shadow-green-900/20';
    }
    if (card.isFlipped) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400 shadow-blue-100 dark:shadow-blue-900/20';
    }
    return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md';
  };

  return (
    <motion.div
      whileHover={!disabled && !card.isFlipped && !card.isMatched ? { y: -2 } : {}}
      whileTap={!disabled && !card.isFlipped && !card.isMatched ? { scale: 0.98 } : {}}
      className={`relative cursor-pointer ${!disabled && !card.isFlipped && !card.isMatched ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => !disabled && !card.isFlipped && !card.isMatched && onClick(index)}
    >
      <div className="aspect-square relative">
        <AnimatePresence mode="wait">
          {card.isFlipped || card.isMatched ? (
            <motion.div
              key="front"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-xl border-2 ${getCardStyle()} flex items-center justify-center text-4xl transition-all duration-200`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {card.icon}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-xl border-2 ${getCardStyle()} flex items-center justify-center transition-all duration-200 shadow-sm`}
            >
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 opacity-20"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// 主游戏组件
export default function MemoryCardGame() {
  const [gameState, setGameState] = React.useState<GameState>({
    cards: [],
    flippedCards: [],
    matches: 0,
    moves: 0,
    timeElapsed: 0,
    isGameStarted: false,
    isGameCompleted: false,
    errorCards: [],
  });

  const timerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // 初始化游戏
  const initializeGame = React.useCallback(() => {
    const shuffledIcons = [...CARD_ICONS].sort(() => Math.random() - 0.5);
    const cards: Card[] = shuffledIcons.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false,
    }));

    setGameState({
      cards,
      flippedCards: [],
      matches: 0,
      moves: 0,
      timeElapsed: 0,
      isGameStarted: false,
      isGameCompleted: false,
      errorCards: [],
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  // 开始游戏
  const startGame = React.useCallback(() => {
    setGameState(prev => ({ ...prev, isGameStarted: true }));
    
    timerRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);
  }, []);

  // 重新开始游戏
  const restartGame = React.useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // 处理卡片点击
  const handleCardClick = React.useCallback((cardIndex: number) => {
    if (!gameState.isGameStarted) return;

    setGameState(prev => {
      const newCards = [...prev.cards];
      const newFlippedCards = [...prev.flippedCards];

      // 如果已经翻开了两张卡片，直接返回
      if (newFlippedCards.length >= 2) return prev;

      // 翻开当前卡片
      newCards[cardIndex].isFlipped = true;
      newFlippedCards.push(cardIndex);

      let newMoves = prev.moves;
      let newMatches = prev.matches;

      // 如果翻开了两张卡片，检查是否匹配
      if (newFlippedCards.length === 2) {
        newMoves += 1;
        const [firstIndex, secondIndex] = newFlippedCards;
        const firstCard = newCards[firstIndex];
        const secondCard = newCards[secondIndex];

                 if (firstCard.icon === secondCard.icon) {
           // 匹配成功
           firstCard.isMatched = true;
           secondCard.isMatched = true;
           newMatches += 1;
           newFlippedCards.splice(0, newFlippedCards.length); // 清空翻开的卡片
         } else {
          // 匹配失败，显示错误状态
          firstCard.isError = true;
          secondCard.isError = true;
          
          // 1.5秒后翻回去并清除错误状态
          setTimeout(() => {
            setGameState(current => {
              const resetCards = [...current.cards];
              resetCards[firstIndex].isFlipped = false;
              resetCards[secondIndex].isFlipped = false;
              resetCards[firstIndex].isError = false;
              resetCards[secondIndex].isError = false;
              return {
                ...current,
                cards: resetCards,
                flippedCards: [],
                errorCards: [],
              };
            });
          }, 1500);
        }
      }

      const updatedState = {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards,
        moves: newMoves,
        matches: newMatches,
      };

      // 检查游戏是否完成
      if (newMatches === TOTAL_PAIRS) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        updatedState.isGameCompleted = true;
      }

      return updatedState;
    });
  }, [gameState.isGameStarted]);

  // 初始化游戏
  React.useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initializeGame]);

  return (
    <div className="w-full px-8">

      {/* 控制面板 */}
      <div className="grid gap-4 max-w-lg mx-auto">
        <GameControlPanel
          timeElapsed={gameState.timeElapsed}
          moves={gameState.moves}
          matches={gameState.matches}
          isGameStarted={gameState.isGameStarted}
          onStart={startGame}
          onRestart={restartGame}
        />
      </div>

      {/* 游戏区域 */}
      <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
        {gameState.cards.map((card, index) => (
          <GameCard
            key={card.id}
            card={card}
            index={index}
            onClick={handleCardClick}
            disabled={gameState.flippedCards.length >= 2 || gameState.isGameCompleted}
          />
        ))}
      </div>

      {/* 游戏完成提示 */}
      <AnimatePresence>
        {gameState.isGameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="text-center p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl max-w-md mx-auto"
          >
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              恭喜完成游戏！
            </div>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <span>用时:</span>
                <span className="font-mono font-semibold">
                  {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>步数:</span>
                <span className="font-mono font-semibold">{gameState.moves}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>准确率:</span>
                <span className="font-mono font-semibold">
                  {gameState.moves > 0 ? Math.round((TOTAL_PAIRS / gameState.moves) * 100) : 100}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
