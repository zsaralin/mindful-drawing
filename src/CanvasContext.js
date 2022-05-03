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
    let {x, y, movementX, movementY} = useTouch();
    let {xM, yM, movementXM, movementYM} = useMouse();

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
            if (movementXM === null && movementYM === null && (Math.abs(movementX) + Math.abs(movementY) > 10 ) ||
                (movementX === null & movementY === null && (Math.abs(movementXM)+ Math.abs(movementYM) > 10))) {
                console.log('slow down' + ' ' + Math.abs(movementXM) + ' ' + Math.abs(movementYM))
                setAlert('Slow Down')
                setShowAlert(true)
            }
            else if  ((movementXM === null && movementYM === null && (Math.abs(movementX) + Math.abs(movementY) < 2 )) ||
                (movementX === null && movementY === null && (Math.abs(movementXM) + Math.abs(movementYM) < 2 ))) {
                console.log('move fast' + ' ' + (Math.abs(movementXM) + Math.abs(movementYM)))
                console.log('movementX' + movementX)
                setAlert('Move Faster')
                setShowAlert(true)
            }
            else {
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
        }, []);
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
            {/*<div style={{position: 'absolute', left: '30px', top: '30px', color: 'black'}}>movementX: {movementX} movementY: {movementY} movementXM: {movementXM} movementYM: {movementYM}</div>*/}

        </CanvasContext.Provider>
    );

};

export const useCanvas = () => useContext(CanvasContext);
