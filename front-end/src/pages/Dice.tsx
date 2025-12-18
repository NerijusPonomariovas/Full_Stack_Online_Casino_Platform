import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import BettingPanel from './games/gamecomponents/BettingPanel';
import sliderBase from '../assets/Rectangle 62.png';
import sliderHandle from '../assets/btn.png';
import './Dice.css';

const Dice = () => {
  const [chance, setChance] = useState(50);
  const [markerValue, setMarkerValue] = useState(50);
  const [finalValue, setFinalValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [outcome, setOutcome] = useState<'win' | 'lose' | null>(null);

  const HOUSE_EDGE = 0.05;
  const payout = useMemo(
    () => (chance > 0 ? ((100 / chance) * (1 - HOUSE_EDGE)).toFixed(2) : '∞'),
    [chance]
  );
  const clampToRange = (value: number) => Math.min(100, Math.max(1, Math.round(value)));
  const markerPercent = useMemo(() => Math.min(99, Math.max(1, markerValue)), [markerValue]);

  useEffect(() => {
    if (!isRolling && finalValue === null) {
      setMarkerValue(clampToRange(chance));
    }
  }, [chance, finalValue, isRolling]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setOutcome(null);
    setFinalValue(null);
    setMarkerValue(clampToRange(chance));

    const animationSteps = 14;
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      const tempValue = clampToRange(Math.floor(Math.random() * 100) + 1);
      setMarkerValue(tempValue);
      if (step >= animationSteps) {
        window.clearInterval(interval);
        const roundedFinal = clampToRange(Math.floor(Math.random() * 100) + 1);
        setMarkerValue(roundedFinal);
        setFinalValue(roundedFinal);
        setOutcome(roundedFinal <= chance ? 'win' : 'lose');
        setIsRolling(false);
      }
    }, 70);
  };

  return (
    <div className="dice-page">
      <BettingPanel>
        <div className="dice-panel">
          <section className="dice-slider">
            <div
              className="chance-visual"
              style={{ '--chance-stop': `${chance}` } as CSSProperties}
            >
              <div
                className="chance-track"
                style={{ backgroundImage: `url(${sliderBase})` }}
              >
                <div
                  className="chance-track-inner"
                  style={{
                   
                    '--chance-stop': `${chance}`,
                  } as CSSProperties}
                >
                  <div className="chance-value">
                    <span>{chance}%</span>
                  </div>
                  <div className="chance-lane">
                    <div
                      className={`chance-marker ${isRolling ? 'rolling' : outcome ?? ''}`}
                      style={{ '--marker-position': `${markerPercent}` } as CSSProperties}
                    >
                      <span>{markerValue}%</span>
                    </div>
                  </div>
                  <div className={`chance-handle ${isRolling ? 'rolling' : ''}`}>
                    <img src={sliderHandle} alt="Chance handle" draggable={false} />
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={95}
                value={chance}
                onChange={(event) => setChance(Number(event.target.value))}
                onInput={(event) => setChance(Number(event.currentTarget.value))}
                className="chance-input"
                aria-label="Adjust win probability"
              />
            </div>
            <div className="chance-labels">
              <span>
                Winning chances <strong>{chance}%</strong>
              </span>
            </div>
          </section>

          <section className="dice-result">
            <div className="dice-actions">
              <button className="dice-roll" onClick={handleRoll} disabled={isRolling}>
                {isRolling ? 'Rolling…' : 'Roll Dice'}
              </button>
              <div className={`dice-roll-value ${outcome ?? ''}`}>
                <div className="dice-roll-value-header">
                  <span>Roll landed at</span>
                  <span className="dice-roll-value-number">
                    {finalValue !== null
                      ? `${finalValue}%`
                      : isRolling
                      ? 'Rolling…'
                      : '—'}
                  </span>
                </div>
                <div className="dice-roll-value-outcome">
                  {isRolling
                    ? ''
                    : finalValue !== null
                    ? outcome === 'win'
                      ? 'Win!'
                      : 'Lost...'
                    : 'Set your odds and roll the dice.'}
                </div>
              </div>
            </div>
          </section>

        </div>
      </BettingPanel>
    </div>
  );
};

export default Dice;
