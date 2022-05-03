import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const {
    canvasRef,
    prepareCanvas,
    startDrawingMouse,
    startDrawingTouch,
    finishDrawing,
    drawMouse,
    drawTouch,
  } = useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
      onMouseDown={startDrawingMouse}
      onMouseUp={finishDrawing}
      onMouseMove={drawMouse}
        onTouchStart={startDrawingTouch}
        onTouchEnd={finishDrawing}
        onTouchMove={drawTouch}
      ref={canvasRef}
    />
  );
}