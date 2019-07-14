import preact from 'preact';
import { Text } from 'preact-i18n';
import t from '../Utility/i18n';
import { detectBlockedCanvasImageExtraction } from '../Utility/browser';

export default class SignatureInput extends preact.Component {
    constructor(props) {
        super(props);

        this.canvas = null;
        this.context = null;
        this.state = {
            width: props.width || 100,
            height: props.height || 100,
            hasBeenDrawnOn: false,
            isEmpty: true,
            backgroundColor: props.backgroundColor || '#fff',
            strokeColor: props.strokeColor || '#000',
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            canvasImageExtractionBlocked: false
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
            canvasImageExtractionBlocked: res
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
        if (!!signature && signature.type === 'image' && !!signature.value) {
            // see https://stackoverflow.com/a/4776378
            let img = new Image();
            img.onload = () => {
                this.clear();
                this.context.drawImage(img, 0, 0);
                this.setState({ isEmpty: false });
                this.handleChange();
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
        this.setState({ isEmpty: true });
        this.handleChange();
    }

    render() {
        return (
            <div className="signature-input">
                <h2 style="margin-top: 1em;">
                    <Text id="signature" />
                </h2>
                <Text id="signature-explanation" />
                <div style={this.state.canvasImageExtractionBlocked ? 'position: relative;' : ''}>
                    <canvas
                        id={this.props.id}
                        style={
                            'max-width: 100%; box-sizing: border-box; background-color: ' + this.state.backgroundColor
                        }
                        ref={el => (this.canvas = el)}
                        width={this.state.width}
                        height={this.state.height}
                        onMouseMove={this.handleMouse}
                        onMouseDown={this.handleMouse}
                        onMouseUp={this.handleMouse}
                        onMouseOut={this.handleMouse}
                    />
                    {this.state.canvasImageExtractionBlocked ? (
                        <div
                            className="canvas-blocked-overlay"
                            style={
                                'position: absolute; top: 2px; left: 2px; background-color: rgba(10, 10, 10, 0.6); box-sizing: border-box; max-width: 100%; width: ' +
                                this.state.width +
                                'px; height: ' +
                                this.state.height +
                                'px; padding: 10px; color: #f0f7ff;'
                            }>
                            <p>
                                {t('overlay-text', 'signature')}
                                {/* <br />
                                <a href="#">{t('overlay-learn-more', 'signature')}</a> */}
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
                                        if (tries-- > 0 && this.state.canvasImageExtractionBlocked) setTimeout(f, 500);
                                    };
                                    f();
                                }}
                                className="button button-primary button-small">
                                {t('overlay-allow', 'signature')}
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
                {!!this.props.fillSignature && this.props.fillSignature.type === 'image' ? (
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
        );
    }

    handleFillSignature() {
        this.drawSignature(this.props.fillSignature);
        this.handleChange();
    }

    handleMouse(event) {
        let x; // Apparently JS linting ignores breaks…
        let y;
        switch (event.type) {
            case 'mousemove':
                if (this.state.isDrawing) {
                    x = event.pageX - this.canvas.offsetLeft;
                    y = event.pageY - this.canvas.offsetTop;
                    this.drawPath(x, y, this.state.strokeColor);
                    this.setState({
                        lastX: x,
                        lastY: y
                    });
                }
                break;
            case 'mousedown':
                x = event.pageX - this.canvas.offsetLeft;
                y = event.pageY - this.canvas.offsetTop;

                this.drawCircle(x, y, 1, this.state.strokeColor);

                this.setState({
                    isDrawing: true,
                    hasBeenDrawnOn: true,
                    isEmpty: false,
                    lastX: x,
                    lastY: y
                });
                break;
            case 'mouseout':
                if (this.state.hasBeenDrawnOn) this.handleChange();
                this.setState({ hasBeenDrawnOn: false });

                this.handleBlockedCanvasImageDetection();
            // fallthrough intentional
            case 'mouseup':
                this.setState({ isDrawing: false });
                break;
        }
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
                value: !this.state.isEmpty ? this.canvas.toDataURL() : ''
            }
        });
    }
}
