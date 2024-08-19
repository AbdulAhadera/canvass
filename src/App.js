import { useRef, useEffect, useState } from "react";
import { BiSolidPencil } from "react-icons/bi";
import { FaRegSquareFull } from "react-icons/fa6";
import { GoCircle } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoRemoveOutline } from "react-icons/io5";
import { TbOvalVertical } from "react-icons/tb";
import { BiUndo } from "react-icons/bi";
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [lineWidth, setLineWidth] = useState(2);
  const [drawingMode, setDrawingMode] = useState('freehand')
  const [lineColor, setLineColor] = useState("black");
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = lineColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;

  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);

    if (drawingMode === 'freehand') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setPaths((prevPaths) => [...prevPaths, { type: "freehand", color: lineColor, width: lineWidth, coordinates: [] }]);
    } else if (drawingMode === "line" || drawingMode === "rectangle" || drawingMode === "circle" || drawingMode === "arrow" || drawingMode === "ellipse") {
      setStartPosition({ x: offsetX, y: offsetY });
    }
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (isDrawing) {
      setIsDrawing(false);
    }

    // Saving all shapes and design in LocalStorage

    //---->Line
    if (drawingMode === 'line') {
      const { offsetX, offsetY } = nativeEvent;
      const { x, y } = startPosition;

      const newPath = {
        type: "line",
        color: lineColor,
        width: lineWidth,
        startX: x,
        startY: y,
        endX: offsetX,
        endY: offsetY,
      };

      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths, newPath];
        localStorage.setItem('paths', JSON.stringify(updatedPaths));
        return updatedPaths;
      })

      contextRef.current.beginPath();
      contextRef.current.

    }
    //--->Rectangle
    if (drawingMode === 'rectangle') {
      const { offsetX, offsetY } = nativeEvent;
      const { x, y } = startPosition;

      const newPath = {
        type: "rectangle",
        color: lineColor,
        width: lineWidth,
        startX: x,
        startY: y,
        endX: offsetX,
        endY: offsetY,
      };

      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths, newPath];
        localStorage.setItem('paths', JSON.stringify(updatedPaths));
        return updatedPaths;
      });

      contextRef.current.beginPath();
      contextRef.current.rect(x, y, offsetX - x, offsetY - y);
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
    //--->Circle 
    else if (drawingMode === 'circle') {
      const { offsetX, offsetY } = nativeEvent;
      const { x, y } = startPosition;

      const radius = Math.sqrt(Math.pow(offsetX - x, 2) + Math.pow(offsetY - y, 2));

      const newPath = {
        type: "circle",
        color: lineColor,
        width: lineWidth,
        centerX: x,
        centerY: y,
        radius: radius,
      };

      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths, newPath];
        localStorage.setItem('paths', JSON.stringify(updatedPaths)); // Save paths to local storage
        return updatedPaths;
      });

      contextRef.current.beginPath();
      contextRef.current.arc(x, y, radius, 0, 2 * Math.PI);
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
    //---->Arrow
    else if (drawingMode === 'arrow') {
      const { offsetX, offsetY } = nativeEvent;
      const { x, y } = startPosition;

      const newPath = {
        type: "arrow",
        color: lineColor,
        width: lineWidth,
        startX: x,
        startY: y,
        endX: offsetX,
        endY: offsetY,
      };


      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths, newPath];
        localStorage.setItem('paths', JSON.stringify(updatedPaths));
        return updatedPaths;
      });

      drawArrow(x, y, offsetX, offsetY, lineColor, lineWidth);

    }
    //---->Ellipse
    if (drawingMode === 'ellipse') {
      const { offsetX, offsetY } = nativeEvent;
      const { x, y } = startPosition;

      const radiusX = Math.abs(offsetX - x) / 2;
      const radiusY = Math.abs(offsetY - y) / 2;
      const centerX = (offsetX + x) / 2;
      const centerY = (offsetY + y) / 2;

      const newPath = {
        type: "ellipse",
        color: lineColor,
        width: lineWidth,
        centerX: centerX,
        centerY: centerY,
        radiusX: radiusX,
        radiusY: radiusY,
      };

      setPaths((prevPaths) => {
        const updatedPaths = [...prevPaths, newPath];
        localStorage.setItem('paths', JSON.stringify(updatedPaths));
        return updatedPaths;
      });
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    //---Draw freehand---//
    if (drawingMode === 'freehand') {
      setPaths((prevPaths) => {
        const newPaths = [...prevPaths];
        const currentPath = newPaths[newPaths.length - 1];
        currentPath.coordinates.push({ offsetX, offsetY });
        localStorage.setItem('paths', JSON.stringify(newPaths));
        return newPaths;
      });

      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
    //---Draw rectangle---//
    else if (drawingMode === 'rectangle') {
      const { x, y } = startPosition;
      redrawCanvas(paths);
      contextRef.current.beginPath();
      contextRef.current.rect(x, y, offsetX - x, offsetY - y);
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
    //---Draw Circle---//
    else if (drawingMode === 'circle') {
      const { x, y } = startPosition;
      redrawCanvas(paths);
      const radius = Math.sqrt(Math.pow(offsetX - x, 2) + Math.pow(offsetY - y, 2));
      contextRef.current.beginPath();
      contextRef.current.arc(x, y, radius, 0, 2 * Math.PI);
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
    //---Draw Arrow---//
    else if (drawingMode === 'arrow') {
      const { x, y } = startPosition;
      redrawCanvas(paths);
      drawArrow(x, y, offsetX, offsetY);
    }
    //---Draw Ellipse---//
    if (drawingMode === 'ellipse') {
      const { x, y } = startPosition;
      redrawCanvas(paths);

      const radiusX = Math.abs(offsetX - x) / 2;
      const radiusY = Math.abs(offsetY - y) / 2;
      const centerX = (offsetX + x) / 2;
      const centerY = (offsetY + y) / 2;

      contextRef.current.beginPath();
      contextRef.current.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      contextRef.current.strokeStyle = lineColor;
      contextRef.current.lineWidth = lineWidth;
      contextRef.current.stroke();
      contextRef.current.closePath();
    }
  };

  const handleLineWidth = (event) => {
    setLineWidth(event.target.value);
  };

  const handleColor = (event) => {
    setLineColor(event.target.value);
    if (contextRef.current) {
      contextRef.current.strokeStyle = event.target.value;
    }
  };

  const getCoordinates = () => {
    const storedPaths = localStorage.getItem('paths');
    if (storedPaths) {
      const parsedPaths = JSON.parse(storedPaths);
      setPaths(parsedPaths);
      redrawCanvas(parsedPaths);
    }
  };

  const redrawCanvas = (paths) => {
    const context = contextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    paths.forEach(path => {
      if (path.type === 'freehand' && path.coordinates.length > 0) {
        context.beginPath();
        context.strokeStyle = path.color;
        context.lineWidth = path.width;
        context.moveTo(path.coordinates[0].offsetX, path.coordinates[0].offsetY);
        path.coordinates.forEach(({ offsetX, offsetY }) => {
          context.lineTo(offsetX, offsetY);
        });
        context.stroke();
        context.closePath();
      }
      else if (path.type === 'rectangle') {
        context.beginPath();
        context.strokeStyle = path.color;
        context.lineWidth = path.width;
        context.rect(path.startX, path.startY, path.endX - path.startX, path.endY - path.startY);
        context.stroke();
        context.closePath();
      }
      else if (path.type === 'circle') {
        context.beginPath();
        context.strokeStyle = path.color;
        context.lineWidth = path.width;
        context.arc(path.centerX, path.centerY, path.radius, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
      }
      else if (path.type === 'arrow') {
        drawArrow(path.startX, path.startY, path.endX, path.endY, path.color, path.width);
      }
      else if (path.type === 'ellipse') {
        contextRef.current.beginPath();
        contextRef.current.ellipse(path.centerX, path.centerY, path.radiusX, path.radiusY, 0, 0, 2 * Math.PI);
        contextRef.current.strokeStyle = path.color;
        contextRef.current.lineWidth = path.width;
        contextRef.current.stroke();
        contextRef.current.closePath();
      }
    });
  };

  // Functionality for drawing Arrow its head and tails
  const drawArrow = (fromX, fromY, toX, toY, pathColor, pathWidth) => {
    const headLength = 15; // Head length

    const angle = Math.atan2(toY - fromY, toX - fromX);

    contextRef.current.beginPath();
    contextRef.current.moveTo(fromX, fromY);
    contextRef.current.lineTo(toX, toY);

    // ----- Draw Arrow Head
    contextRef.current.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    contextRef.current.moveTo(toX, toY);
    contextRef.current.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));

    // ----- Arrow Styling
    contextRef.current.strokeStyle = pathColor;
    contextRef.current.lineWidth = pathWidth;
    contextRef.current.stroke();
    contextRef.current.closePath();
  };

  const undo = () => {
    setPaths((prevPaths) => {
      if (prevPaths.length === 0) return prevPaths; // koi path nhai to action bhi nhi

      const updatedPaths = prevPaths.slice(0, -1); // paths get krke last wala ura do

      localStorage.setItem('paths', JSON.stringify(updatedPaths)); // again update local storage

      redrawCanvas(updatedPaths); // redraw canvas without last part
      return updatedPaths;
    });
  };
  // redo wala task baki hai

  const setFreehandMode = () => {
    setDrawingMode('freehand');
  };

  const setRectangleMode = () => {
    setDrawingMode('rectangle');
  };
  const setCircleMode = () => {
    setDrawingMode('circle');
  };
  const setArrowMode = () => {
    setDrawingMode('arrow');
  };
  const setEllipseMode = () => {
    setDrawingMode('ellipse');
  };
  const setLineMode = () => {
    setDrawingMode('line')
  };

  return (
    <>
      <div className="main">
        <div className="tools">
          <select className="dropdown" value={lineWidth} onChange={handleLineWidth}>
            <option value={1}>Stroke</option>
            <option value={2}>2 px</option>
            <option value={4}>4 px</option>
            <option value={6}>6 px</option>
            <option value={8}>8 px</option>
          </select>

          <div className="color-picker">
            <input
              className="color-box"
              type="color"
              value={lineColor}
              onChange={handleColor}
            />
          </div>
          <button className="button" onClick={setFreehandMode}>
            <BiSolidPencil />
          </button>
          <button className="button" onClick={setLineMode}>
            <IoRemoveOutline />
          </button>
          <button className="button" onClick={setRectangleMode}>
            <FaRegSquareFull />
          </button>
          <button className="button" onClick={setCircleMode}>
            <GoCircle />
          </button>
          <button className="button" onClick={setArrowMode}>
            <IoIosArrowRoundForward />
          </button>
          <button className="button" onClick={setEllipseMode}>
            <TbOvalVertical />
          </button>
          <button className="button" onClick={undo}>
            <BiUndo />
          </button>

          <button className="button-get" onClick={getCoordinates}>Get Last</button>
        </div>

        <div className="canvas">
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
          <line x1="0" y1="80" x2="100" y2="20" stroke="black" />
        </div>
      </div>
    </>
  );
}

export default App;
