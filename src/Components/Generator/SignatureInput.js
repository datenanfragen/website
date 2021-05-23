import { Component } from 'preact';
import { Text, IntlProvider } from 'preact-i18n';
import { detectBlockedCanvasImageExtraction } from '../../Utility/browser';
import PropTypes from 'prop-types';

export default class SignatureInput extends Component {
    constructor(props) {
        super(props);

        this.canvas = null;
        this.context = null;
        this.initialCropArea = {
            top: props.height || 100,
            bottom: 0,
            left: props.width || 100,
            right: 0,
        };
        this.state = {
            width: props.width || 100,
            height: props.height || 100,
            hasBeenDrawnOn: false,
            isEmpty: true,
            strokeColor: props.strokeColor || '#2d3748',
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            canvasImageExtractionBlocked: false,
            cropArea: this.initialCropArea,
        };

        this.handleMouse = this.handleMouse.bind(this);
        this.handleFillSignature = this.handleFillSignature.bind(this);
        this.handleBlockedCanvasImageDetection = this.handleBlockedCanvasImageDetection.bind(this);
        this.clear = this.clear.bind(this);
    }

    handleBlockedCanvasImageDetection() {
        const res = detectBlockedCanvasImageExtraction(this.context);
        const force_update = this.state.canvasImageExtractionBlocked !== res;
        this.setState({
            canvasImageExtractionBlocked: res,
        });

        // TODO @zner0L: Due to your modifications to `shouldComponentUpdate()`, I need to force an update here. Without
        // those modifications, the component breaks. Even with the manual update, the button text seems to get lost. I
        // don't really have any idea why that would be the case.
        if (force_update) this.forceUpdate();
    }

    componentDidMount() {
        this.context = this.canvas.getContext('2d');

        this.handleBlockedCanvasImageDetection();
    }

    componentDidUpdate() {
        this.context = this.canvas.getContext('2d');
        if (this.state.isEmpty) this.drawSignature(this.props.value);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }

    drawSignature(signature) {
        if (signature?.type === 'image' && signature?.value) {
            // see https://stackoverflow.com/a/4776378
            let img = new Image();
            img.onload = () => {
                const left = (this.canvas.width - img.width) / 2;
                const top = (this.canvas.height - img.height) / 2;
                this.clear();
                this.context.drawImage(img, left, top);
                this.setState(
                    {
                        isEmpty: false,
                        cropArea: {
                            top,
                            bottom: img.height + top,
                            left,
                            right: img.width + left,
                        },
                    },
                    () => this.handleChange()
                );
            };
            img.src = signature.value;
        }
    }

    drawCircle(x, y, radius, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.arc(x, y, radius, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.closePath();
    }

    drawPath(x, y, strokeStyle, lineWidth = 1) {
        this.context.beginPath();
        this.context.moveTo(this.state.lastX, this.state.lastY);
        this.context.lineTo(x, y);
        this.context.strokeStyle = strokeStyle;
        this.context.lineWidth = lineWidth;
        this.context.stroke();
        this.context.closePath();
    }

    clear() {
        if (this.state.isEmpty) return;
        this.context.clearRect(0, 0, this.state.width, this.state.height);
        this.setState({ isEmpty: true, cropArea: this.initialCropArea }, () => this.handleChange());
    }

    render() {
        // As much as I would like it, adding keyboard events ain't gun make this accessible…
        /* eslint-disable jsx-a11y/mouse-events-have-key-events */
        return (
            <IntlProvider scope="signature" definition={I18N_DEFINITION}>
                <div className="signature-input">
                    <h2 style="margin-top: 1em;">
                        <Text id="signature" />
                    </h2>
                    <Text id={this.props.isForIdData ? 'signature-explanation-id-data' : 'signature-explanation'} />
                    <div
                        style={
                            (this.state.canvasImageExtractionBlocked ? 'position: relative;' : '') +
                            `width: 100%; max-width: ${this.state.width}px;`
                        }>
                        <canvas
                            id={this.props.id}
                            style={`width: 100%;
                                height: ${this.state.height}px;
                                box-sizing: border-box;`}
                            ref={(el) => (this.canvas = el)}
                            width={this.state.width}
                            height={this.state.height}
                            onPointerMove={this.handleMouse}
                            onPointerDown={this.handleMouse}
                            onPointerUp={this.handleMouse}
                            onPointerOut={this.handleMouse}
                        />
                        {this.state.canvasImageExtractionBlocked ? (
                            <div
                                className="canvas-blocked-overlay"
                                style={`position: absolute; top: 0; left: 0; box-sizing: border-box; max-width: 100%; width: ${this.state.width}px; height: ${this.state.height}px; padding: 10px;`}>
                                <p>
                                    <Text id="overlay-text" />
                                    {/* <br />
                                     <a href="#"><Text id="overlay-learn-more" /></a> */}
                                </p>
                                <button
                                    onClick={() => {
                                        // This doesn't cause a prompt if the user has previously denied one for us. I however
                                        // also am not aware of a way to force a prompt in that case (or even to detect that
                                        // this has happened), so I don't think there's anything else we can do here.
                                        this.context.getImageData(0, 0, 1, 1);

                                        // This is ugly. There is no way to be notified of the result of the permission prompt,
                                        // so we just have to try.
                                        // TODO: Is this even necessary? The check will be triggered anyway in the `onmouseout`
                                        // event.
                                        let tries = 50;
                                        let f = () => {
                                            this.handleBlockedCanvasImageDetection();
                                            if (tries-- > 0 && this.state.canvasImageExtractionBlocked)
                                                setTimeout(f, 500);
                                        };
                                        f();
                                    }}
                                    className="button button-primary button-small">
                                    <Text id="overlay-allow" />
                                </button>
                            </div>
                        ) : (
                            []
                        )}
                    </div>
                    <button
                        className="button button-small button-secondary"
                        onClick={this.clear}
                        style="float: right; margin: 0 0 5px 5px;">
                        <Text id="reset-signature" />
                    </button>
                    {this.props.fillSignature?.type === 'image' ? (
                        <button
                            style="float: right;"
                            className="button button-small button-secondary"
                            onClick={this.handleFillSignature}>
                            <Text id="fill-signature" />
                        </button>
                    ) : (
                        []
                    )}
                    <div className="clearfix" />
                </div>
            </IntlProvider>
        );
        /* eslint-enable */
    }

    handleFillSignature() {
        this.drawSignature(this.props.fillSignature);
        this.handleChange();
    }

    handleMouse(event) {
        let x; // Apparently JS linting ignores breaks…
        let y;
        switch (event.type) {
            case 'pointermove':
                if (this.state.isDrawing) {
                    x = event.pageX - this.canvas.offsetLeft;
                    y = event.pageY - this.canvas.offsetTop;
                    this.drawPath(x, y, this.state.strokeColor);
                    this.setState({
                        lastX: x,
                        lastY: y,
                    });
                    this.setNewCropArea(x, y);
                }
                break;
            case 'pointerdown':
                if (this.canvas.width !== this.canvas.parentElement.scrollWidth) {
                    this.canvas.width = this.canvas.parentElement.scrollWidth;
                }

                x = event.pageX - this.canvas.offsetLeft;
                y = event.pageY - this.canvas.offsetTop;

                this.drawCircle(x, y, 1, this.state.strokeColor);
                this.setNewCropArea(x, y);

                this.setState({
                    isDrawing: true,
                    hasBeenDrawnOn: true,
                    isEmpty: false,
                    lastX: x,
                    lastY: y,
                });
                break;
            case 'pointerout':
                if (this.state.hasBeenDrawnOn) this.handleChange();
                this.setState({ hasBeenDrawnOn: false });

                this.handleBlockedCanvasImageDetection();
            // fallthrough intentional
            case 'pointerup':
                this.setState({ isDrawing: false });
                break;
        }
    }

    setNewCropArea(x, y) {
        const newCropArea = { ...this.state.cropArea };
        const { top, bottom, left, right } = newCropArea;
        if (x > right) {
            newCropArea.right = x;
        }
        if (x < left) {
            newCropArea.left = x;
        }
        if (y > bottom) {
            newCropArea.bottom = y;
        }
        if (y < top) {
            newCropArea.top = y;
        }

        this.setState({ cropArea: newCropArea });
    }

    get croppedCanvas() {
        const { bottom, top, left, right } = this.state.cropArea;
        const height = bottom - top + 4;
        const width = right - left + 4;
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCanvas
            .getContext('2d')
            .drawImage(this.context.canvas, left - 2, top - 2, width, height, 0, 0, width, height);
        return croppedCanvas;
    }

    handleChange() {
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
        this.props.onChange({
            signature: {
                type: this.state.isEmpty ? 'text' : 'image',
                value: !this.state.isEmpty ? this.croppedCanvas.toDataURL() : '',
            },
        });
    }

    static propTypes = {
        id: PropTypes.string.isRequired,

        height: PropTypes.number,
        width: PropTypes.number,
        strokeColor: PropTypes.string,

        value: PropTypes.object.isRequired,
        fillSignature: PropTypes.object,

        isForIdData: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };
}
