import preact from 'preact';
import { Text } from 'preact-i18n';

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
            lastY: 0
        };

        this.handleMouse = this.handleMouse.bind(this);
        this.handleFillSignature = this.handleFillSignature.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentDidMount() {
        this.context = this.canvas.getContext('2d');
    }

    componentDidUpdate() {
        this.context = this.canvas.getContext('2d');
        if(this.state.isEmpty) this.drawSignature(this.props.value);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }

    drawSignature(signature) {
        if(!!signature && signature.type === 'image' && !!signature.value) {
            // see https://stackoverflow.com/a/4776378
            let img = new Image;
            img.onload = () => {
                this.clear();
                this.context.drawImage(img,0,0);
                this.setState({isEmpty: false});
                this.handleChange();
            };
            img.src = signature.value;
        }
    }

    drawCircle(x, y, radius, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.arc(x, y, radius, 0, Math.PI*2, false);
        this.context.fill();
        this.context.closePath();
    };

    drawPath(x, y, strokeStyle, lineWidth = 1) {
        this.context.beginPath();
        this.context.moveTo(this.state.lastX, this.state.lastY);
        this.context.lineTo(x, y);
        this.context.strokeStyle = strokeStyle;
        this.context.lineWidth = lineWidth;
        this.context.stroke();
        this.context.closePath();
    };

    clear() {
        if(this.state.isEmpty) return;
        this.context.clearRect(0, 0, this.state.width, this.state.height);
        this.setState({isEmpty: true});
        this.handleChange();
    };

    render() {
        return (
            <div className="signature-input">
                <h2><Text id="signature" /></h2>
                <Text id="signature-explanation" />
                <div><canvas id={this.props.id} style={'background-color: ' + this.state.backgroundColor } ref={el => this.canvas = el} width={this.state.width} height={this.state.height} onMouseMove={this.handleMouse} onMouseDown={this.handleMouse} onMouseUp={this.handleMouse} onMouseOut={this.handleMouse} /></div>
                <button className="button-secondary" onClick={this.clear}><Text id="reset" /></button>{!!this.props.fillSignature && this.props.fillSignature.type === 'image' ? <button style="float: right" className="button-secondary" onClick={this.handleFillSignature}><Text id="fill-signature" /></button> : [] }
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
        switch(event.type) {
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
                if(this.state.hasBeenDrawnOn) {
                    this.handleChange();
                }
                this.setState({hasBeenDrawnOn: false});
            case 'mouseup':
                this.setState({isDrawing: false});
                break;
        }

    }

    handleChange() {
        this.props.onChange({
            signature: {
                type: this.state.isEmpty ? 'text' : 'image',
                value: !this.state.isEmpty ? this.canvas.toDataURL() : ''
            }
        });
    }

}
