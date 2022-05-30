import React, {useContext, useEffect, useRef, useState} from "react";
import "./CanvasContext.css"

import Audio1 from './Audio/Audio1.mp3'
const CanvasContext = React.createContext();

let audio = new Audio(Audio1);
audio.volume = .2;
audio.play();

function getRandomColor() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
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
    const [color, setColor] = useState('false')


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
        setColor(getRandomColor())

        // const { offsetX, offsetY } = nativeEvent;
        // contextRef.current.strokeStyle = getRandomColor()

        // contextRef.current.strokeRect(100, 100, 50, 50);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        // increaseVol();
    };

    const startDrawingMouse = ({nativeEvent}) => {

        const { offsetX, offsetY } = nativeEvent;
        // let color = getRandomColor()
        // contextRef.current.strokeStyle = color;
        // contextRef.current.lineWidth = 35;
        setColor(getRandomColor())
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);

        setIsDrawing(true);
        // increaseVol();

        // audio.volume = .8;

    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        decreaseVol();
    };

    const drawTouch = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }

        var rect = nativeEvent.target.getBoundingClientRect();
        var offsetX = nativeEvent.targetTouches[0].pageX - rect.left;
        var offsetY = nativeEvent.targetTouches[0].pageY - rect.top;

        // const { offsetX, offsetY } = nativeEvent;
        // contextRef.current.lineTo(offsetX, offsetY);
        // contextRef.current.stroke();
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = 5;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.7)';
        contextRef.current.lineWidth = 10;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.5)';
        contextRef.current.lineWidth = 20;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.3)';
        contextRef.current.lineWidth = 30;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.2)';
        contextRef.current.lineWidth = 40;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.1)';
        contextRef.current.lineWidth = 50;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

    };

    const drawMouse = ({nativeEvent}) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;

        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = 5;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.7)';
        contextRef.current.lineWidth = 10;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.5)';
        contextRef.current.lineWidth = 20;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.3)';
        contextRef.current.lineWidth = 30;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.2)';
        contextRef.current.lineWidth = 40;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();

        contextRef.current.strokeStyle = color.substring(0,color.length-2)+ '0.1)';
        contextRef.current.lineWidth = 50;
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
                // console.log('slow down' + ' ' + Math.abs(movementXM) + ' ' + Math.abs(movementYM))
                setAlert('Slow Down')
                setShowAlert(true)
            }
            else if  ((movementXM === null && movementYM === null && (Math.abs(movementX) + Math.abs(movementY) < 2 )) ||
                (movementX === null && movementY === null && (Math.abs(movementXM) + Math.abs(movementYM) < 2 ))) {
                // console.log('move fast' + ' ' + (Math.abs(movementXM) + Math.abs(movementYM)))
                // console.log('movementX' + movementX)
                setAlert('Move Faster')
                setShowAlert(true)
                decreaseVol()
            }
            else {
                setShowAlert(false)
                // console.log('good speed' + ' ' + movementXM + ' ' + movementYM)
            }
        } else {
            setShowAlert(false)
            // console.log('no show' + ' ' + movementXM + ' ' + movementYM)

        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            sendAlert()
        }, );
        return () => clearTimeout(timer);
    },)

    useEffect(() => {
        // console.log('CURRENT VOL increase ' + audio.volume)
        // Reduce volume by 0.05 as long as it is above 0
        // This works as long as you start with a multiple of 0.05!
        var increaseVol = setInterval(function() {
        if (audio.volume < 0.8 && isDrawing) {
            // console.log("increasing" + audio.volume)
            audio.volume += .02;
        }
        else {
            // Stop the setInterval when 0 is reached
            clearInterval(increaseVol);
        }
        }, 200);
        // var decreaseVol = setTimeout(function() {
        //     if (audio.volume > .05 && !isDrawing) {
        //         console.log("decreasing" + audio.volume)
        //         audio.volume -= .05;
        //     }
        //     else {
        //         // Stop the setInterval when 0 is reached
        //         clearInterval(decreaseVol);
        //     }
        // }, 2000);

        // else if (audio.volume > 0.05 && !isDrawing) {
        //     console.log("decreasing" + audio.volume)
        //     audio.volume -= .05;
        // }
    },[x, y, xM, yM])

    // useEffect(() => {
    //     var interval = 200; // 200ms interval
    //     var increaseVol = setInterval(
    //         function() {
    //             console.log('CURRENT VOL decrease ' + audio.volume)
    //             // Reduce volume by 0.05 as long as it is above 0
    //             // This works as long as you start with a multiple of 0.05!
    //             if (audio.volume > 0.05 && !isDrawing) {
    //                 audio.volume -= .05;
    //             }
    //             else {
    //                 // Stop the setInterval when 0 is reached
    //                 clearInterval(increaseVol);
    //             }
    //         }, 2000);
    // },[isDrawing])

    // function increaseVol(){
    //     console.log('dfdgfg')
    //     var interval = 200; // 200ms interval
    //     var increaseVol = setInterval(
    //         function() {
    //             console.log('CURRENT VOL increase ' + audio.volume)
    //             // Reduce volume by 0.05 as long as it is above 0
    //             // This works as long as you start with a multiple of 0.05!
    //             if (audio.volume < 0.8 ) {
    //                 audio.volume += .05;
    //             }
    //             else {
    //                 // Stop the setInterval when 0 is reached
    //                 clearInterval(increaseVol);
    //             }
    //         }, interval);}




    function decreaseVol(){
        var interval = 200; // 200ms interval
        var decreaseVol = setInterval(
            function() {
                // console.log('CURRENT VOL decrease' + audio.volume)
                // Reduce volume by 0.05 as long as it is above 0
                // This works as long as you start with a multiple of 0.05!
                if (audio.volume - 0.05 > 0.2) {
                    audio.volume -= .01;
                }
                else {
                    // Stop the setInterval when 0 is reached
                    clearInterval(decreaseVol);
                }
        }, interval);
    }


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
                {alert}</div>
        </CanvasContext.Provider>
    );

};

export const useCanvas = () => useContext(CanvasContext);
