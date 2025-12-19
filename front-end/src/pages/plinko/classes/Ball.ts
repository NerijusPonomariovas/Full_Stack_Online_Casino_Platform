import { gravity, horizontalFriction, verticalFriction } from "../constants";
import type { Obstacle, Sink } from "../objects";
import { pad, unpad } from "../padding";

export class Ball {
    private x: number;
    private y: number;
    private radius: number;
    private color: string;
    private vx: number;
    private vy: number;
    private ctx: CanvasRenderingContext2D;
    private obstacles: Obstacle[]
    private sinks: Sink[]
    private onFinish: (index: number) => void;
    private finished: boolean;
    private targetSinkIndex?: number;
    private maxObstacleY: number;
    private lastY: number;
    private stuckFrames: number;
    private totalFrames: number;
    private minSinkX: number;
    private maxSinkX: number;
    private minBound: number;
    private maxBound: number;
    private lowestSinkTop: number;

    constructor(x: number, y: number, radius: number, color: string, ctx: CanvasRenderingContext2D, obstacles: Obstacle[], sinks: Sink[], onFinish: (index: number) => void, targetSinkIndex?: number) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = 0;
      this.vy = 0;
      this.ctx = ctx;
      this.obstacles = obstacles;
      this.sinks = sinks;
      this.onFinish = onFinish;
      this.finished = false;
      this.targetSinkIndex = targetSinkIndex;
      this.maxObstacleY = obstacles.length ? Math.max(...obstacles.map(o => unpad(o.y) + o.radius)) : 0;
      this.lastY = y;
      this.stuckFrames = 0;
      this.totalFrames = 0;
      // Cache sink bounds for performance (avoid recalculating every frame)
      if (this.sinks.length > 0) {
        this.minSinkX = Math.min(...this.sinks.map((s) => unpad(s.x))) - this.sinks[0].width / 2;
        this.maxSinkX = Math.max(...this.sinks.map((s) => unpad(s.x))) + this.sinks[0].width / 2;
        this.minBound = this.minSinkX + this.radius;
        this.maxBound = this.maxSinkX - this.radius;
        this.lowestSinkTop = Math.min(...this.sinks.map((s) => unpad(s.y) - s.height / 2));
      } else {
        this.minSinkX = 0;
        this.maxSinkX = 1100;
        this.minBound = 0;
        this.maxBound = 1100;
        this.lowestSinkTop = 700;
      }
    }
  
    public isFinished(): boolean {
      return this.finished;
    }
  
    draw() {
      if (this.finished) return;
      this.ctx.beginPath();
      this.ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    update() {
      if (this.finished) return;
      
      this.vy += gravity;
      this.totalFrames++;
      
      // Emergency teleport if ball takes too long
      if (this.totalFrames > 150 && this.targetSinkIndex !== undefined && this.targetSinkIndex >= 0 && this.targetSinkIndex < this.sinks.length) {
        const sink = this.sinks[this.targetSinkIndex];
        this.x = sink.x;
        this.y = sink.y;
        this.finished = true;
        this.vx = 0;
        this.vy = 0;
        this.onFinish(this.targetSinkIndex);
        return;
      }
      
      // Apply velocity updates
      this.x += this.vx;
      this.y += this.vy;

      // Keep balls within horizontal bounds (use cached values for performance)
      let clampedX = unpad(this.x);
      if (clampedX < this.minBound) {
        clampedX = this.minBound;
        this.vx = Math.abs(this.vx) * 0.5;
      } else if (clampedX > this.maxBound) {
        clampedX = this.maxBound;
        this.vx = -Math.abs(this.vx) * 0.5;
      }
      this.x = pad(clampedX);
  
      // Collision with obstacles - simplified to prevent sticking
      this.obstacles.forEach(obstacle => {
        const dx = this.x - obstacle.x;
        const dy = this.y - obstacle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = pad(this.radius + obstacle.radius);
        
        if (dist < minDist && dist > 0) {
          // Push ball away from obstacle
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = unpad(minDist - dist) + 3;
          
          // Strong positional correction
          this.x += pad(nx * overlap);
          this.y += pad(ny * overlap);
          
          // Bounce velocity with random variation for plinko effect
          const randomFactor = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
          this.vx = nx * Math.abs(unpad(this.vx)) * horizontalFriction * randomFactor;
          this.vy = Math.max(ny * Math.abs(unpad(this.vy)) * verticalFriction, 1.5);
          this.vy = pad(this.vy);
          
          // Add small random horizontal kick for variety
          this.vx += pad((Math.random() - 0.5) * 0.8);
        }
      });
      
      // Force minimum downward velocity after all collisions
      if (this.vy < pad(1.5)) {
        this.vy = pad(1.5);
      }
      
      // Stuck detection AFTER collisions (so teleports aren't undone)
      const yDiff = Math.abs(unpad(this.y) - unpad(this.lastY));
      if (yDiff < 0.3) {
        this.stuckFrames++;
        if (this.stuckFrames > 15) {
          // Aggressive teleport down to escape stuck position
          this.y += pad(8);
          this.vy = pad(3.0);
          this.stuckFrames = 0;
        }
      } else {
        this.stuckFrames = 0;
      }
      this.lastY = this.y;
  
      // Collision with sinks - use cached value for performance
      const ballBottom = unpad(this.y) + this.radius;

      // Subtle guidance ONLY near sinks (85% down) to let plinko physics work naturally
      if (!this.finished && this.targetSinkIndex !== undefined && this.targetSinkIndex >= 0 && this.targetSinkIndex < this.sinks.length) {
        const sink = this.sinks[this.targetSinkIndex];
        const py = unpad(this.y);
        
        // Start guidance very late at 85% down (let physics work most of the time)
        if (py >= this.maxObstacleY * 0.85) {
          if (py >= this.maxObstacleY) {
            // Below all pegs: LOCK position to target sink x-coordinate and finish immediately
            this.x = sink.x;
            this.y = sink.y;
            this.finished = true;
            this.vx = 0;
            this.vy = 0;
            this.onFinish(this.targetSinkIndex);
            return;
          } else {
            // Still among pegs: gentle lerp toward target
            const dxp = sink.x - this.x;
            this.x += dxp * 0.25; // gentle guidance
            this.vx *= 0.8;
          }
        }
      }

      // Finalize when reaching sink band: snap to target if set
      if (!this.finished && ballBottom >= this.lowestSinkTop - 20) {
        // If we have a target sink, force finish to that specific sink and place ball visually at that sink
        if (this.targetSinkIndex !== undefined && this.targetSinkIndex >= 0 && this.targetSinkIndex < this.sinks.length) {
          const sink = this.sinks[this.targetSinkIndex];
          this.x = sink.x;
          this.y = sink.y;

          this.finished = true;
          this.vx = 0;
          this.vy = 0;
          this.onFinish(this.targetSinkIndex);
        } else {
          // No target - use physical collision detection
          for (let i = 0; i < this.sinks.length; i++) {
            const sink = this.sinks[i];
            const sinkTop = unpad(sink.y) - sink.height / 2;
            
            if (
                unpad(this.x) >= unpad(sink.x) - sink.width / 2 &&
                unpad(this.x) <= unpad(sink.x) + sink.width / 2 &&
                ballBottom >= sinkTop - 15 &&
                ballBottom <= sinkTop + sink.height
            ) {
                this.x = sink.x;
                this.y = sink.y;
                this.finished = true;
                this.vx = 0;
                this.vy = 0;
                this.onFinish(i);
                break;
            }
          }
          
          // Fallback: snap to nearest if past sink line
          if (!this.finished && ballBottom > this.lowestSinkTop + 5) {
            let nearest = 0;
            let best = Number.MAX_VALUE;
            for (let i = 0; i < this.sinks.length; i++) {
              const dx = Math.abs(unpad(this.x) - unpad(this.sinks[i].x));
              if (dx < best) {
                best = dx;
                nearest = i;
              }
            }
            const sink = this.sinks[nearest];
            this.x = sink.x;
            this.y = sink.y;
            this.finished = true;
            this.vx = 0;
            this.vy = 0;
            this.onFinish(nearest);
          }
        }
      }
    }
  
  }