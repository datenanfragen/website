import { JSX } from 'preact';
import { useRef, Ref, useEffect, MutableRef, useState } from 'preact/hooks';
import { Text, IntlProvider } from 'preact-i18n';
import type { Signature } from '../../types/request';
import { detectBlockedCanvasImageExtraction } from '../../Utility/browser';
import { useGeneratorStore } from '../../store/generator';

type Color = string;

type SignatureInputProps = {
    id: string;

    height?: number;
    width?: number;
    strokeColor?: Color;

    value: Signature;
    fillSignature?: Signature;

    isForIdData?: boolean;

    onChange: (signature: Signature) => void;
};

type Position = { x: number; y: number };

export const SignatureInput = (props: SignatureInputProps) => {
    const canvas: Ref<HTMLCanvasElement> = useRef(null);
    const context: MutableRef<CanvasRenderingContext2D | null> = useRef(null);
    const [canvasImageExtractionBlocked, setCanvasImageExtractionBlocked] = useState(false);
    const [isEmpty, setEmpty] = useState(true);
    const [lastPosition, setLastPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDrawing, setDrawing] = useState(false);
    const [hasBeenDrawnOn, setHasBeenDrawnOn] = useState(false);

    const strokeColor: Color = props.strokeColor || '#2d3748';
    const height = props.height || 100;
    const width = props.width || 100;

    const initialCropArea = {
        top: height,
        bottom: 0,
        left: width,
        right: 0,
    };
    const [cropArea, setCropArea] = useState<CropArea>(initialCropArea);

    // Mice are scary!
    const handleMouse = (event: JSX.TargetedMouseEvent<HTMLCanvasElement>) => {
        if (!canvas.current || !context.current) return;
        switch (event.type) {
            case 'pointermove':
                if (isDrawing) {
                    const x = event.pageX - canvas.current.offsetLeft;
                    const y = event.pageY - canvas.current.offsetTop;
                    drawPath(context.current, lastPosition, { x, y }, strokeColor);
                    setLastPosition({ x, y });
                    setCropArea(newCropAreaFromPenPosition(x, y, cropArea));
                }
                break;
            case 'pointerdown':
                {
                    if (canvas.current.width !== canvas.current.parentElement?.scrollWidth) {
                        canvas.current.width = canvas.current.parentElement?.scrollWidth || 100;
                    }

                    const x = event.pageX - canvas.current.offsetLeft;
                    const y = event.pageY - canvas.current.offsetTop;

                    drawCircle(context.current, { x, y }, 1, strokeColor);
                    setCropArea(newCropAreaFromPenPosition(x, y, cropArea));

                    setDrawing(true);
                    setLastPosition({ x, y });
                    setEmpty(false);
                    setHasBeenDrawnOn(true);
                }

                break;
            case 'pointerout':
                if (hasBeenDrawnOn)
                    /*
                        Canvas data cannot be extracted in Firefox with `privacy.resistFingerprinting` enabled or Tor Browser by
                        default (see #69). Instead, the browser simply returns a white image.

                        While there is a permission to allow specific sites to extract image data and the user is prompted to give
                        that permission (in Firefox since https://bugzilla.mozilla.org/show_bug.cgi?id=1413780), the prompt is only
                        shown when the browser considers the event to be triggered by user input.
                        From what I can gather, this does *not* mean `e.isTrusted === true`. There seems to be a different, more
                        strict requirement.

                        I have decided on a different approach but if we wanted the prompt to be shown, we would simply need to call
                        `this.canvas.toDataURL()` (or any other of the image-extracting APIs) in the `onmousedown` event.
                        */
                    props.onChange(
                        isEmpty
                            ? { type: 'text', name: props.value.name || '' }
                            : {
                                  type: 'image',
                                  value: !isEmpty ? getCroppedCanvas(canvas.current, cropArea).toDataURL() || '' : '',
                                  name: props.value.name || undefined,
                              }
                    );
                setHasBeenDrawnOn(false);

                setCanvasImageExtractionBlocked(detectBlockedCanvasImageExtraction(context.current));
            // fallthrough intentional
            case 'pointerup':
                setDrawing(false);
                break;
        }
    };

    const handleImageExtractionDetection = () => {
        if (!context.current) return;
        // This doesn't cause a prompt if the user has previously denied one for us. I however
        // also am not aware of a way to force a prompt in that case (or even to detect that
        // this has happened), so I don't think there's anything else we can do here.
        context.current.getImageData(0, 0, 1, 1);

        // This is ugly. There is no way to be notified of the result of the permission prompt,
        // so we just have to try.
        // TODO: Is this even necessary? The check will be triggered anyway in the `onmouseout`
        // event.
        let tries = 50;
        const f = () => {
            setCanvasImageExtractionBlocked(detectBlockedCanvasImageExtraction(context.current));
            if (tries-- > 0 && canvasImageExtractionBlocked) setTimeout(f, 500);
        };
        f();
    };

    useEffect(() => {
        if (!canvas.current) return;
        context.current = canvas.current.getContext('2d');
        setCanvasImageExtractionBlocked(detectBlockedCanvasImageExtraction(context.current));
    }, [canvas]);

    useEffect(() => {
        if (isEmpty && context.current)
            drawSignature(context.current, props.value).then((newCropArea) => {
                if (newCropArea) {
                    setEmpty(false);
                    setCropArea(newCropArea);
                }
            });
    }, [context, isEmpty, props.value]);

    // As much as I would like it, adding keyboard events ain't gun make this accessible…
    /* eslint-disable jsx-a11y/mouse-events-have-key-events */
    return (
        <IntlProvider scope="signature" definition={window.I18N_DEFINITION}>
            <div className="signature-input">
                <h2 style="margin-top: 1em;">
                    <Text id="signature" />
                </h2>
                <Text id={props.isForIdData ? 'signature-explanation-id-data' : 'signature-explanation'} />
                <div
                    style={
                        (canvasImageExtractionBlocked ? 'position: relative;' : '') +
                        `width: 100%; max-width: ${width}px;`
                    }>
                    <canvas
                        id={props.id}
                        style={`width: 100%;
                                height: ${height}px;
                                box-sizing: border-box;`}
                        ref={canvas}
                        width={width}
                        height={height}
                        onPointerMove={handleMouse}
                        onPointerDown={handleMouse}
                        onPointerUp={handleMouse}
                        onPointerOut={handleMouse}
                    />
                    {canvasImageExtractionBlocked && (
                        <div
                            className="canvas-blocked-overlay"
                            style={`position: absolute; top: 0; left: 0; box-sizing: border-box; max-width: 100%; width: ${width}px; height: ${height}px; padding: 10px;`}>
                            <p>
                                <Text id="overlay-text" />
                                {/* <br />
                                     <a href="#"><Text id="overlay-learn-more" /></a> */}
                            </p>
                            <button
                                onClick={handleImageExtractionDetection}
                                className="button button-primary button-small">
                                <Text id="overlay-allow" />
                            </button>
                        </div>
                    )}
                </div>
                <button
                    className="button button-small button-secondary"
                    onClick={() => {
                        // Clear the canvas
                        if (!isEmpty && context.current) {
                            context.current.clearRect(0, 0, width, height);
                            setEmpty(true);
                            setCropArea(initialCropArea);
                            props.onChange({ type: 'text', name: props.value.name || '' });
                        }
                    }}
                    style="float: left; margin-right: 5px">
                    <Text id="reset-signature" />
                </button>
                {props.fillSignature?.type === 'image' && (
                    <button
                        style="float: left;"
                        className="button button-small button-secondary"
                        onClick={() => {
                            if (context.current && props.fillSignature?.type === 'image')
                                drawSignature(context.current, props.fillSignature).then((newCropArea) => {
                                    if (!newCropArea || props.fillSignature?.type !== 'image') return;
                                    setEmpty(false);
                                    setCropArea(newCropArea);
                                    props.onChange(props.fillSignature);
                                });
                        }}>
                        <Text id="fill-signature" />
                    </button>
                )}
                <div className="clearfix" />
            </div>
        </IntlProvider>
    );
    /* eslint-enable */
};

export const StatefulSignatureInput = (props: Partial<SignatureInputProps>) => {
    const setSignature = useGeneratorStore((state) => state.setSignature);
    const signature = useGeneratorStore((state) => state.request.signature);

    return (
        <SignatureInput id="signature" width={428} height={190} onChange={setSignature} value={signature} {...props} />
    );
};

type CropArea = {
    right: number;
    left: number;
    top: number;
    bottom: number;
};

function newCropAreaFromPenPosition(x: number, y: number, previousCropArea: CropArea) {
    const newCropArea: CropArea = { ...previousCropArea };

    if (x > newCropArea.right) newCropArea.right = x;
    else if (x < newCropArea.left) newCropArea.left = x;

    if (y > newCropArea.bottom) newCropArea.bottom = y;
    else if (y < newCropArea.top) newCropArea.top = y;

    return newCropArea;
}

function getCroppedCanvas(canvas: HTMLCanvasElement, cropArea: CropArea) {
    const { bottom, top, left, right } = cropArea;
    const height = bottom - top + 4;
    const width = right - left + 4;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;

    croppedCanvas?.getContext('2d')?.drawImage(canvas, left - 2, top - 2, width, height, 0, 0, width, height);
    return croppedCanvas;
}

function drawSignature(ctx: CanvasRenderingContext2D, signature: Signature): Promise<CropArea | null> {
    return new Promise((resolve, reject) => {
        if (signature?.type === 'image' && signature?.value) {
            // see https://stackoverflow.com/a/4776378
            const img = new Image();
            img.onload = () => {
                const left = (ctx.canvas.width - img.width) / 2;
                const top = (ctx.canvas.height - img.height) / 2;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage(img, left, top);
                resolve({
                    top,
                    bottom: img.height + top,
                    left,
                    right: img.width + left,
                });
            };
            img.src = signature.value;
        } else resolve(null);
    });
}

function drawCircle(ctx: CanvasRenderingContext2D, pos: Position, radius: number, fillColor: Color) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function drawPath(
    ctx: CanvasRenderingContext2D,
    start_pos: Position,
    end_pos: Position,
    strokeStyle: string,
    lineWidth = 1
) {
    ctx.beginPath();
    ctx.moveTo(start_pos.x, start_pos.y);
    ctx.lineTo(end_pos.x, end_pos.y);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
}

// TODO: Maybe memo this?
