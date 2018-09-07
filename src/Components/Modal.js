import preact from 'preact';
import Portal from 'preact-portal';

export default class Modal extends preact.Component {
    render() {
        let positiveButton = this.props.positiveText ? <button className={this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onPositiveFeedback} style={"float: left"}>{this.props.positiveText}</button> : '';
        let negativeButton = this.props.negativeText ? <button className={!this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onNegativeFeedback} style={"float: right"}>{this.props.negativeText}</button> : '';
        return <Portal into="body">
            <div className='modal'>
                <div className="backdrop" onClick={this.props.onDismiss} />
                <div className="inner">
                    {this.props.children}
                    <div className="button-group">
                        {positiveButton}
                        {negativeButton}
                    </div>
                </div>
            </div>
        </Portal>;
    }
}
