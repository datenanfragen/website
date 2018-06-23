import preact from 'preact';
import Portal from 'preact-portal';

export default class Modal extends preact.Component {
    render() {
        return <Portal into="body">
            <div className='modal'>
                <div className="backdrop" onClick={this.props.onDismiss} />
                <div className="inner">
                    {this.props.children}
                    <div className="button-group">
                        <button className={this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onPositiveFeedback} style={"float: left"}>{this.props.positiveText}</button>
                        <button className={!this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onNegativeFeedback} style={"float: right"}>{this.props.negativeText}</button>
                    </div>
                </div>
            </div>
        </Portal>;
    }
}
