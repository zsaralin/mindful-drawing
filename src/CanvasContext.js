import React, {useContext, useEffect, useRef, useState} from "react";

import "./CanvasContext.css"

const CanvasContext = React.createContext();

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function useMouse() {
    const [mousePosition, setMousePosition] = useState({
        xM: null,
        yM: null,
        movementXM: null,
        movementYM: null,
    });
    useEffect(() => {
        function handle(e) {
            setMousePosition({
                xM: e.pageX,
                yM: e.pageY,
                movementXM: e.movementX,
                movementYM: e.movementY
            })
        }

        document.addEventListener("mousemove", handle);
        return () => document.removeEventListener("mousemove", handle)
    })
    return mousePosition
}

function useTouch() {
    const [touchPosition, setTouchPosition] = useState({
        x: null,
        y: null,
        movementX: null,
        movementY: null,
    });
    useEffect(() => {
        function handle(e) {
            setTouchPosition({
                movementX: e.touches[0].pageX - touchPosition?.x,
                movementY: e.touches[0].pageY - touchPosition?.y,
                x: e.touches[0].pageX,
                y: e.touches[0].pageY,
            })
        }
        document.addEventListener("touchmove", handle);
        return () => document.removeEventListener("touchmove", handle)
    })
    return touchPosition
}

export const CanvasProvider = ({children}) => {
    const {x, y, movementX, movementY} = useTouch();
    const {xM, yM, movementXM, movementYM} = useMouse();

  const [isDrawing, setIsDrawing] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alert, setAlert] = useState(undefined)


    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const prepareCanvas = () => {
        const canvas = canvasRef.current
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d")
        context.scale(2, 2);
        context.lineCap = 'round'
        context.lineJoin = 'round'
        // context.strokeStyle = getRandomColor();
        context.lineWidth = 35;
        contextRef.current = context;
    };

    const startDrawingTouch = ({nativeEvent}) => {
        const rect = nativeEvent.target.getBoundingClientRect();
        const offsetX = nativeEvent.targetTouches[0].pageX - rect.left;
        const offsetY = nativeEvent.targetTouches[0].pageY - rect.top;

        // const { offsetX, offsetY } = nativeEvent;
        contextRef.current.strokeStyle = getRandomColor();
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const startDrawingMouse = ({nativeEvent}) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.strokeStyle = getRandomColor();
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const drawTouch = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        var rect = nativeEvent.target.getBoundingClientRect();
        var offsetX = nativeEvent.targetTouches[0].pageX - rect.left;
        var offsetY = nativeEvent.targetTouches[0].pageY - rect.top;

        // const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const drawMouse = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d")
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    function sendAlert() {
        if (isDrawing) {
            if ((Math.abs(movementX) > 20 || Math.abs(movementY) > 20 ) ||
                (Math.abs(movementXM) > 20 || Math.abs(movementYM) > 20)) {
                console.log('slow down' + ' ' + movementXM + ' ' + movementYM)
                setAlert('Slow Down')
                setShowAlert(true)
            } else if ((Math.abs(movementX) < 2 && Math.abs(movementY) < 2 ) ||
                (Math.abs(movementXM) < 2 && Math.abs(movementYM) < 2)) {
                setAlert('Move Faster')
                console.log('move fast' + ' ' + movementXM + ' ' + movementYM)
                setShowAlert(true)
            } else {
                setShowAlert(false)
                console.log('good speed' + ' ' + movementXM + ' ' + movementYM)
            }
        } else {
            setShowAlert(false)
            console.log('no show' + ' ' + movementXM + ' ' + movementYM)

        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            sendAlert()
        }, 100);
        return () => clearTimeout(timer);
    },)

    return (
        <CanvasContext.Provider
            value={{
                canvasRef,
                contextRef,
                prepareCanvas,
                startDrawingMouse,
                startDrawingTouch,
                finishDrawing,
                clearCanvas,
                drawTouch,
                drawMouse
            }}
        >
            {children}
            <div className={showAlert === true ? "displayAlert" : "noDisplayAlert"}
                 style={{left: x !== null ? x:xM, top: y !== null ? y - 80:yM-80}}>
                {/*style = {{left: '50px', top: '50px'}}>*/}
                {alert}</div>
            {/*<div style={{position: 'absolute', left: '30px', top: '30px', color: 'black'}}>{x} {xM} {y} {yM} {alert}</div>*/}
            {/*<div style={{position: 'absolute', left: '30px', top: '30px', color: 'black'}}>{movementX} {movementXM} {movementY} {movementYM}</div>*/}

        </CanvasContext.Provider>
    );

};

export const useCanvas = () => useContext(CanvasContext);
