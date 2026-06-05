import { useState, useEffect } from 'react';

export function TicTacToe({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState<'PLAYING' | 'WIN' | 'LOSS' | 'DRAW'>('PLAYING');

  const checkWinner = (b: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.includes(null) ? null : 'DRAW';
  };

  const handleClick = (i: number) => {
    if (board[i] || !isPlayerTurn || status !== 'PLAYING') return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleEnd(winner);
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && status === 'PLAYING') {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length > 0) {
          const aiMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsPlayerTurn(true);
          const winner = checkWinner(newBoard);
          if (winner) handleEnd(winner);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, status, board]);

  const handleEnd = (result: string) => {
    if (result === 'X') {
      setStatus('WIN');
      setTimeout(() => onComplete(1.2), 1000);
    } else if (result === 'O') {
      setStatus('LOSS');
      setTimeout(() => onComplete(0.5), 1000);
    } else {
      setStatus('DRAW');
      setTimeout(() => onComplete(1.0), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-emerald-500 uppercase tracking-tighter">VA AGENCY: TASK DELEGATION</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Outsmart the backlog (Win to succeed)</p>
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 h-48">
        {board.map((cell, i) => (
          <button
            key={i}
            data-testid={`cell-${i}`}
            onClick={() => handleClick(i)}
            className="w-full h-full bg-slate-800 border border-slate-700 rounded flex items-center justify-center text-2xl font-black"
          >
            <span className={cell === 'X' ? 'text-emerald-400' : 'text-rose-500'}>
              {cell}
            </span>
          </button>
        ))}
      </div>

      <div className="text-xs font-black uppercase tracking-widest h-4">
        {status === 'PLAYING' ? (isPlayerTurn ? 'Your Turn' : 'VA Processing...') : status}
      </div>
    </div>
  );
}
