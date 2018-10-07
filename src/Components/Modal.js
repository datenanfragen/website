import preact from 'preact';
import Portal from 'preact-portal';
import t from "../Utility/i18n";

export default class Modal extends preact.Component {
    render() {
        let positiveButton = this.props.positiveText ? <button className={this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onPositiveFeedback} style={"float: right"}>{this.props.positiveText}</button> : '';
        let negativeButton = this.props.negativeText ? <button className={!this.props.positiveDefault ? 'button-primary' : ''} onClick={this.props.onNegativeFeedback} style={"float: left"}>{this.props.negativeText}</button> : '';
        return <Portal into="body">
            <div className='modal'>
                <div className="backdrop" onClick={this.props.onDismiss} />
                <div className="inner">
                    {!!this.props.onDismiss ? <a className="close-button icon-close" onClick={this.props.onDismiss} title={t('cancel', 'generator')} /> : [] }
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
