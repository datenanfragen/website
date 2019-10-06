import preact from 'preact';
import "../src/styles/main.scss"
import "../src/styles/elements.scss"
import "../src/styles/generator.scss"

var destination = document.getElementById("reactDropdown");

export default class DropdownComponent extends preact.Component {
    constructor(props) {
        super(props);
        this.state = [];
    }
	render(){
		return(
			<div className="dropdown-container">
                <a className="button button-secondary menu-link" href="javascript:void(0)">
                	<span className="icon icon-menu" title="{{ T "header-open-menu" . }}"></span>
            	</a>
                <div className="dropdown" id="personal-menu">
                    <div className="mobile-only">
                        <a className="button button-primary icon icon-letter menu-link" href="{{ "generator" | absURL }}" style={{borderRadius: '0'}}>{{ T "header-generator" }}</a>
                        <a href="{{ "company" | absURL }}" className="menu-link">{{ T "header-cdb" }}</a>
                        <a href="{{ "blog" | absURL }}" className="menu-link">{{ T "header-blog" }}</a>
                    </div>
                    <a href="{{ "my-requests" | absURL }}" className="menu-link">{{ T "header-my-requests" }}</a>
                    <a href="{{ "id-data-controls" | absURL }}"
                        className="menu-link">{{ T "header-id-data-controls" }}</a>
                    <a href="{{ "privacy-controls" | absURL }}"
                        className="menu-link">{{ T "header-privacy-controls" }}</a>
                    <div id="personal-menu-i18n-widget" className="i18n-widget-container"></div>
                    <div id="id-data-controls"></div>
                </div>
            </div>
			)
	}
}

Preact.render(<DropdownComponent />, destination);